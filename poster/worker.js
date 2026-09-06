/**
 * Cloudflare Worker —— 海报原型的 AI 后端
 *
 * 用法：
 *   1. https://dash.cloudflare.com → Workers & Pages → Create → Start with Hello World
 *   2. 把这整个文件的内容粘贴进编辑器，覆盖原来的
 *   3. Settings → Bindings → Add → Workers AI，Variable name 填 AI
 *   4. Deploy，把 https://xxx.workers.dev 这个网址给我
 *
 * 不需要任何 API key，不需要绑卡。Workers AI 每天 10,000 Neurons 免费，
 * 本工具一次调用约 10 Neurons，够点一千次。超了会报错，不会扣钱。
 */

// 钉死模型版本。别用带 latest 的名字 —— 模型悄悄换掉会让结果前后不一致，
// 这在做研究时是致命的，在作品集里也会让人觉得"上次不是这样的"。
const MODEL = '@cf/meta/llama-3.1-8b-instruct';

const BANNED = ['时光','岁月','印记','痕迹','记忆','传承','匠心','东方美学','对话',
  '之美','之旅','密码','密语','回响','诗意','意境','灵韵','千年','穿越','邂逅','觅'];

const BRIEF_SYS = `你在为一个虚构的中国工艺／陶瓷主题展览起名并写简介。

要求：
1. 标题 2–5 个汉字。没有副标题，没有标点。
2. 简介一句话，20–35 字，必须含一个**具体**的东西：一个数字、一种材料、一个窑口、一个年代或一个动作。
3. 场馆写一个真实存在的中国博物馆或美术馆。
4. 调子是写给平面设计师的一句指令，6–12 字，说画面该怎么做，不是说展览有多好。
5. tags 从这张表里选 1–2 个，选最贴合调子的：
   quiet 安静克制 / loud 响亮 / mono 只用一支墨 / dark 深底 / big 器物很大 /
   small 器物很小 / rep 重复排列 / dots 网点 / blue 偏蓝 / ring 器物上有洞 / crop 允许裁切

禁用词，出现即失败：${BANNED.join('、')}

绝对不要写成这样：
《时光的印记》—— 一场关于千年陶瓷之美的对话。
《东方意境》—— 感受传统工艺的匠心传承。

要写成这样：
{"t":"器不语","d":"三十一件宋瓷，没有一件有铭文。","v":"浙江省博物馆","k":"克制，别冷","tags":["quiet"]}
{"t":"未完成","d":"十七件残器。缺口是它们唯一说话的地方。","v":"南京博物院","k":"断面要硬","tags":["dark","crop"]}
{"t":"蓝的迁徙","d":"钴料从波斯走到景德镇，用了八百年。","v":"上海博物馆","k":"两支蓝，一冷一暖","tags":["blue"]}
{"t":"一千次同一","d":"龙泉窑的一个碗型，烧了四百年。","v":"龙泉青瓷博物馆","k":"重复里的极小差别","tags":["rep"]}

只输出一个 JSON 对象。不要解释，不要 markdown 代码块，不要任何前后缀。`;

// AI 在这里只做一件事：说人话。它拿到的是画面语言，不是数字，
// 也不允许它给出任何参数 —— 参数由确定性引擎负责，这是整套架构的分界线。
const ARGUE_SYS = `你是平面设计工作室里说话很直的同事。用户刚做完一版海报，
你要指出他一直在重复什么，然后推一个方向相反的方案。

规则：
- 40–70 字，中文，一到两句。
- 先说出你观察到的**具体重复**，再说反面是什么。
- 用问句结尾。不要用命令句，不要夸他，不要说"也许可以试试"。
- 只用画面语言（切线、色域、器物、留白、浓淡），绝不出现数字参数。

只输出这句话本身，不要引号，不要解释。`;

export default {
  async fetch(req, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (req.method !== 'POST') return reply({ ok: false, error: 'POST only' }, cors);

    let body = {};
    try { body = await req.json(); } catch (_) { /* 空 body 也让它跑 */ }
    const path = new URL(req.url).pathname;

    try {
      if (path === '/brief') return reply(await brief(env, body), cors);
      if (path === '/argue') return reply(await argue(env, body), cors);
      return reply({ ok: false, error: 'unknown path' }, cors);
    } catch (e) {
      // 失败必须诚实地传回去。前端会显示「AI 暂时不可用」并退回本地命题池，
      // 绝不假装那是模型写的 —— 一旦假装过一次，整个东西就不可信了。
      return reply({ ok: false, error: String((e && e.message) || e) }, cors);
    }
  },
};

const reply = (obj, cors) =>
  new Response(JSON.stringify(obj), {
    headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' },
  });

async function run(env, sys, user, maxTokens) {
  const r = await env.AI.run(MODEL, {
    messages: [{ role: 'system', content: sys }, { role: 'user', content: user }],
    max_tokens: maxTokens || 220,
    temperature: 0.95,   // 起名字要发散。太低会一直吐同一个词。
  });
  return (r && (r.response || r.result || '')).trim();
}

async function brief(env, body) {
  // 把最近出过的题回传给模型让它避开 —— 比调温度更可靠地防重复
  const avoid = Array.isArray(body.avoid) ? body.avoid.slice(0, 12) : [];
  const user = avoid.length
    ? `再编一个。这些已经出现过，换一个完全不同的角度：${avoid.join('、')}`
    : '编一个。';

  for (let attempt = 0; attempt < 3; attempt++) {
    const raw = await run(env, BRIEF_SYS, user, 260);
    const obj = grabJSON(raw);
    if (!obj) continue;
    const t = String(obj.t || '').replace(/[《》""'',。、！？\s]/g, '');
    const d = String(obj.d || '').trim();
    const v = String(obj.v || '').trim();
    const k = String(obj.k || '').trim();
    // 校验：字数、禁用词、必要字段。不合格就重试，重试三次还不行就让前端降级。
    if (t.length < 2 || t.length > 5) continue;
    if (!d || !v || !k) continue;
    if (BANNED.some((w) => (t + d + k).includes(w))) continue;
    if (/[A-Za-z]{3,}/.test(t)) continue;                       // 中文任务里冒出英文单词
    const tags = Array.isArray(obj.tags) ? obj.tags.slice(0, 2) : [];
    return { ok: true, model: MODEL, brief: { t, d, v, k, tags } };
  }
  return { ok: false, error: '模型连续三次没给出合格的题目' };
}

async function argue(env, body) {
  // 前端传来的是画面语言的描述，不是参数
  const now = String(body.now || '').slice(0, 500);
  const alt = String(body.alt || '').slice(0, 500);
  const hist = Array.isArray(body.history) ? body.history.slice(0, 5).join('；') : '';
  const user = `他做的这版：${now}\n` +
    (hist ? `他前几版：${hist}\n` : '') +
    `你要推的反面方案：${alt}`;
  const text = await run(env, ARGUE_SYS, user, 160);
  const clean = text.replace(/^["'「『]+|["'」』]+$/g, '').trim();
  if (!clean || clean.length < 12) return { ok: false, error: '模型没给出可用的意见' };
  return { ok: true, model: MODEL, text: clean.slice(0, 120) };
}

// 小模型经常在 JSON 外面包一层 markdown 或者加一句废话，这里把第一个完整对象抠出来
function grabJSON(s) {
  const a = s.indexOf('{');
  if (a < 0) return null;
  let depth = 0;
  for (let i = a; i < s.length; i++) {
    if (s[i] === '{') depth++;
    else if (s[i] === '}') {
      depth--;
      if (depth === 0) {
        try { return JSON.parse(s.slice(a, i + 1)); } catch (_) { return null; }
      }
    }
  }
  return null;
}
