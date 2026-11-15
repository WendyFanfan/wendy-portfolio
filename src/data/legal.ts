import type { L, Locale } from '../i18n/locales'
import { identity } from './identity'
import { site } from './site'

/**
 * Impressum (§ 5 DDG) and Datenschutzerklärung (GDPR) for wendyfan.com.
 * The German text is the legally binding version; EN/ZH are translations.
 *
 * ⚠ Fill in the postal address below (must be a serviceable address, not a P.O. box).
 * This is a template that describes how the site actually works — not legal advice.
 */
/**
 * Links to /impressum and /datenschutz are hidden until this is true.
 * Set it once the real postal address is filled in below (see TODO.md).
 */
export const legalPublished = false

export const legalContact = {
  name: identity.legal,
  // TODO: replace both lines with the real postal address.
  street: '[Straße und Hausnummer]',
  city: '[PLZ] Dresden',
  country: { en: 'Germany', de: 'Deutschland', zh: '德国' } as L,
  email: site.email,
}

/** Last reviewed — update when the site's data processing changes. */
export const legalUpdated: L = { en: 'November 2026', de: 'November 2026', zh: '2026年11月' }

export type LegalKind = 'impressum' | 'privacy'

export type Block =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'address' }
  | { type: 'email' }

export interface LegalSection {
  heading: string
  blocks: Block[]
}

export interface LegalDoc {
  title: string
  intro?: string
  sections: LegalSection[]
}

const p = (text: string): Block => ({ type: 'p', text })

export const legalDocs: Record<LegalKind, Record<Locale, LegalDoc>> = {
  impressum: {
    de: {
      title: 'Impressum',
      sections: [
        { heading: 'Angaben gemäß § 5 DDG', blocks: [{ type: 'address' }] },
        { heading: 'Kontakt', blocks: [{ type: 'email' }] },
        { heading: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV', blocks: [p(`${identity.legal}, Anschrift wie oben.`)] },
        {
          heading: 'Haftung für Links',
          blocks: [
            p(
              'Diese Website enthält Links zu externen Websites Dritter (z. B. LinkedIn, GitHub, Instagram). Auf deren Inhalte habe ich keinen Einfluss; für sie ist stets der jeweilige Anbieter verantwortlich. Bei Bekanntwerden von Rechtsverletzungen entferne ich solche Links umgehend.',
            ),
          ],
        },
        {
          heading: 'Urheberrecht',
          blocks: [
            p(
              'Die Inhalte dieser Website – insbesondere Texte, Fotografien und Gemälde – sind, soweit nicht anders angegeben, urheberrechtlich geschützt. Eine Verwendung außerhalb der Grenzen des Urheberrechts bedarf meiner vorherigen Zustimmung.',
            ),
          ],
        },
      ],
    },
    en: {
      title: 'Legal notice (Impressum)',
      sections: [
        { heading: 'Information pursuant to § 5 DDG (German Digital Services Act)', blocks: [{ type: 'address' }] },
        { heading: 'Contact', blocks: [{ type: 'email' }] },
        { heading: 'Responsible for content pursuant to § 18(2) MStV', blocks: [p(`${identity.legal}, address as above.`)] },
        {
          heading: 'Liability for links',
          blocks: [
            p(
              'This website contains links to external third-party websites (e.g. LinkedIn, GitHub, Instagram). I have no influence over their content; the respective provider is always responsible for it. If I become aware of any legal violations, I will remove such links immediately.',
            ),
          ],
        },
        {
          heading: 'Copyright',
          blocks: [
            p(
              'Unless stated otherwise, the content of this website — in particular texts, photographs and paintings — is protected by copyright. Any use beyond the limits of copyright law requires my prior consent.',
            ),
          ],
        },
      ],
    },
    zh: {
      title: '网站信息（Impressum）',
      sections: [
        { heading: '依据德国《数字服务法》（DDG）第 5 条提供的信息', blocks: [{ type: 'address' }] },
        { heading: '联系方式', blocks: [{ type: 'email' }] },
        { heading: '依据《州际媒体条约》（MStV）第 18 条第 2 款的内容负责人', blocks: [p(`${identity.legal}，地址同上。`)] },
        {
          heading: '外部链接责任',
          blocks: [p('本网站包含指向第三方外部网站的链接（如 LinkedIn、GitHub、Instagram）。我无法影响这些网站的内容，其内容由各自的提供方负责。一旦发现违法内容，我会立即移除相关链接。')],
        },
        {
          heading: '版权',
          blocks: [p('除另有说明外，本网站的内容——尤其是文字、摄影和油画作品——均受版权保护。超出版权法许可范围的使用，须事先征得我的同意。')],
        },
      ],
    },
  },

  privacy: {
    de: {
      title: 'Datenschutzerklärung',
      intro:
        'Kurz gesagt: Diese Website verwendet keine Cookies, keine Analyse- oder Tracking-Werkzeuge und lädt keine Inhalte von Drittanbietern. Schriftarten und Bilder werden direkt von dieser Website ausgeliefert.',
      sections: [
        { heading: '1. Verantwortliche', blocks: [{ type: 'address' }, { type: 'email' }] },
        {
          heading: '2. Hosting und Server-Logfiles',
          blocks: [
            p(
              'Diese Website wird bei Netlify, Inc. (San Francisco, USA) gehostet. Beim Aufruf der Website verarbeitet Netlify technisch notwendige Daten, insbesondere:',
            ),
            { type: 'list', items: ['IP-Adresse', 'Datum und Uhrzeit des Zugriffs', 'aufgerufene Seite bzw. Datei', 'Referrer-URL', 'verwendeter Browser und Betriebssystem'] },
            p(
              'Diese Verarbeitung ist erforderlich, um die Website auszuliefern und ihre Sicherheit zu gewährleisten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; mein berechtigtes Interesse liegt im sicheren und zuverlässigen Betrieb der Website.',
            ),
            p(
              'Netlify verarbeitet Daten auch in den USA. Die Übermittlung stützt sich auf die Standardvertragsklauseln der EU-Kommission sowie, soweit vorhanden, auf eine Zertifizierung nach dem EU-U.S. Data Privacy Framework. Weitere Informationen: https://www.netlify.com/privacy/',
            ),
          ],
        },
        {
          heading: '3. Lokale Speicherung der Spracheinstellung',
          blocks: [
            p(
              'Wenn Sie eine Sprache auswählen, wird diese Auswahl im lokalen Speicher Ihres Browsers (localStorage, Eintrag „wendy-locale“) abgelegt, damit die Website beim nächsten Besuch in derselben Sprache erscheint. Die Information verlässt Ihr Gerät nicht und wird nicht an mich übermittelt. Rechtsgrundlage ist § 25 Abs. 2 Nr. 2 TDDDG, da die Speicherung für die von Ihnen gewünschte Funktion unbedingt erforderlich ist. Sie können den Eintrag jederzeit über die Einstellungen Ihres Browsers löschen.',
            ),
          ],
        },
        {
          heading: '4. Kontakt per E-Mail',
          blocks: [
            p(
              'Wenn Sie mir eine E-Mail schreiben, verarbeite ich Ihre Angaben, um Ihre Anfrage zu beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit einem Vertrag oder vorvertraglichen Maßnahmen – etwa einem Bewerbungsverfahren – zusammenhängt, ansonsten Art. 6 Abs. 1 lit. f DSGVO. Ich lösche die Daten, sobald sie nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.',
            ),
          ],
        },
        {
          heading: '5. Links zu anderen Websites',
          blocks: [
            p(
              'Diese Website verlinkt auf Profile und Websites Dritter (LinkedIn, GitHub, Instagram, X, Xiaohongshu, rerisnap.com). Daten werden an den jeweiligen Anbieter erst übertragen, wenn Sie einen solchen Link anklicken; ab dann gelten dessen Datenschutzbestimmungen.',
            ),
          ],
        },
        {
          heading: '6. Ihre Rechte',
          blocks: [
            p('Sie haben im Rahmen der gesetzlichen Vorgaben das Recht auf:'),
            {
              type: 'list',
              items: [
                'Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)',
                'Berichtigung unrichtiger Daten (Art. 16 DSGVO)',
                'Löschung (Art. 17 DSGVO)',
                'Einschränkung der Verarbeitung (Art. 18 DSGVO)',
                'Datenübertragbarkeit (Art. 20 DSGVO)',
                'Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21 DSGVO)',
              ],
            },
            p(
              'Zudem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO), zum Beispiel bei der für Sachsen zuständigen Behörde: Die Sächsische Datenschutz- und Transparenzbeauftragte, https://www.datenschutz.sachsen.de',
            ),
          ],
        },
      ],
    },
    en: {
      title: 'Privacy policy',
      intro:
        'In short: this website uses no cookies, no analytics or tracking tools, and loads no third-party content. Fonts and images are served directly from this website.',
      sections: [
        { heading: '1. Controller', blocks: [{ type: 'address' }, { type: 'email' }] },
        {
          heading: '2. Hosting and server log files',
          blocks: [
            p('This website is hosted by Netlify, Inc. (San Francisco, USA). When you visit the site, Netlify processes technically necessary data, in particular:'),
            { type: 'list', items: ['IP address', 'date and time of access', 'requested page or file', 'referrer URL', 'browser and operating system'] },
            p(
              'This processing is necessary to deliver the website and keep it secure. The legal basis is Art. 6(1)(f) GDPR; my legitimate interest is the secure and reliable operation of the website.',
            ),
            p(
              "Netlify also processes data in the USA. Transfers are based on the European Commission's Standard Contractual Clauses and, where applicable, on certification under the EU-U.S. Data Privacy Framework. More information: https://www.netlify.com/privacy/",
            ),
          ],
        },
        {
          heading: '3. Local storage of your language choice',
          blocks: [
            p(
              'When you choose a language, the choice is stored in your browser\'s local storage (localStorage, entry "wendy-locale") so that the website appears in the same language on your next visit. This information never leaves your device and is not sent to me. The legal basis is § 25(2) no. 2 TDDDG, as storage is strictly necessary for the function you requested. You can delete the entry at any time in your browser settings.',
            ),
          ],
        },
        {
          heading: '4. Contact by email',
          blocks: [
            p(
              'If you email me, I process your details to answer your enquiry. The legal basis is Art. 6(1)(b) GDPR where your enquiry relates to a contract or pre-contractual steps — such as a recruitment process — and otherwise Art. 6(1)(f) GDPR. I delete the data once it is no longer needed and no statutory retention obligations apply.',
            ),
          ],
        },
        {
          heading: '5. Links to other websites',
          blocks: [
            p(
              'This website links to third-party profiles and websites (LinkedIn, GitHub, Instagram, X, Xiaohongshu, rerisnap.com). Data is only transferred to the respective provider when you click such a link; from then on, their privacy policy applies.',
            ),
          ],
        },
        {
          heading: '6. Your rights',
          blocks: [
            p('Within the limits set by law, you have the right to:'),
            {
              type: 'list',
              items: [
                'access the data stored about you (Art. 15 GDPR)',
                'rectification of inaccurate data (Art. 16 GDPR)',
                'erasure (Art. 17 GDPR)',
                'restriction of processing (Art. 18 GDPR)',
                'data portability (Art. 20 GDPR)',
                'object to processing based on Art. 6(1)(f) GDPR (Art. 21 GDPR)',
              ],
            },
            p(
              'You may also lodge a complaint with a data protection supervisory authority (Art. 77 GDPR), for example the authority responsible for Saxony: Die Sächsische Datenschutz- und Transparenzbeauftragte, https://www.datenschutz.sachsen.de',
            ),
          ],
        },
      ],
    },
    zh: {
      title: '隐私政策',
      intro: '简而言之：本网站不使用 Cookie，不使用任何分析或追踪工具，也不加载任何第三方内容。字体和图片均直接由本网站提供。',
      sections: [
        { heading: '1. 负责人', blocks: [{ type: 'address' }, { type: 'email' }] },
        {
          heading: '2. 托管与服务器日志',
          blocks: [
            p('本网站托管于 Netlify, Inc.（美国旧金山）。访问本网站时，Netlify 会处理技术上必需的数据，主要包括：'),
            { type: 'list', items: ['IP 地址', '访问日期和时间', '访问的页面或文件', '来源网址（Referrer）', '所使用的浏览器和操作系统'] },
            p('这些处理是向您提供网站并保障其安全所必需的。法律依据为《通用数据保护条例》（GDPR）第 6 条第 1 款 f 项；我的正当利益在于网站的安全、稳定运行。'),
            p('Netlify 也会在美国处理数据。数据传输依据欧盟委员会的标准合同条款，以及（如适用）欧盟—美国数据隐私框架认证。更多信息：https://www.netlify.com/privacy/'),
          ],
        },
        {
          heading: '3. 语言设置的本地存储',
          blocks: [
            p(
              '当您选择语言时，该选择会保存在您浏览器的本地存储中（localStorage，条目名为“wendy-locale”），以便下次访问时以相同语言显示。该信息不会离开您的设备，也不会发送给我。法律依据为德国《电信数字服务数据保护法》（TDDDG）第 25 条第 2 款第 2 项，因为该存储是实现您所请求功能的必要条件。您可以随时在浏览器设置中删除该条目。',
            ),
          ],
        },
        {
          heading: '4. 通过电子邮件联系',
          blocks: [
            p(
              '如果您给我发送电子邮件，我会处理您提供的信息以回复您的询问。如您的询问与合同或签约前措施（例如招聘流程）有关，法律依据为 GDPR 第 6 条第 1 款 b 项，否则为第 6 条第 1 款 f 项。在数据不再需要且无法定保存义务时，我会将其删除。',
            ),
          ],
        },
        {
          heading: '5. 指向其他网站的链接',
          blocks: [p('本网站包含指向第三方主页和网站的链接（LinkedIn、GitHub、Instagram、X、小红书、rerisnap.com）。只有当您点击这些链接时，数据才会传输给相应的提供方，此后适用其隐私政策。')],
        },
        {
          heading: '6. 您的权利',
          blocks: [
            p('在法律规定的范围内，您享有以下权利：'),
            {
              type: 'list',
              items: [
                '查询您被存储的数据（GDPR 第 15 条）',
                '更正不准确的数据（GDPR 第 16 条）',
                '删除数据（GDPR 第 17 条）',
                '限制处理（GDPR 第 18 条）',
                '数据可携带（GDPR 第 20 条）',
                '反对基于 GDPR 第 6 条第 1 款 f 项的处理（GDPR 第 21 条）',
              ],
            },
            p('您还可以向数据保护监管机构投诉（GDPR 第 77 条），例如负责萨克森州的机构：Die Sächsische Datenschutz- und Transparenzbeauftragte，https://www.datenschutz.sachsen.de'),
          ],
        },
      ],
    },
  },
}
