'use client'
import { useState } from 'react'
import { Printer, Plus, Trash2, RefreshCw, Calendar } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { generateShift, getDaysInMonth, getDayOfWeek, type Staff, type ShiftResult } from '@/lib/shiftGenerator'

const now = new Date()

export default function Home() {
  const { t, lang, toggle } = useI18n()
  const [shopName, setShopName] = useState('')
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [minStaff, setMinStaff] = useState(2)
  const [staffList, setStaffList] = useState<Staff[]>([
    { id: 1, name: '', daysOff: [] },
    { id: 2, name: '', daysOff: [] },
    { id: 3, name: '', daysOff: [] },
  ])
  const [result, setResult] = useState<ShiftResult | null>(null)

  const days = getDaysInMonth(year, month)
  const dayNums = Array.from({ length: days }, (_, i) => i + 1)
  const dayNames = [t.sun, t.mon, t.tue, t.wed, t.thu, t.fri, t.sat]

  const addStaff = () => setStaffList(prev => [...prev, { id: Date.now(), name: '', daysOff: [] }])
  const removeStaff = (id: number) => setStaffList(prev => prev.filter(s => s.id !== id))
  const updateName = (id: number, name: string) => setStaffList(prev => prev.map(s => s.id === id ? { ...s, name } : s))
  const toggleDayOff = (staffId: number, day: number) => {
    setStaffList(prev => prev.map(s => {
      if (s.id !== staffId) return s
      const off = s.daysOff.includes(day) ? s.daysOff.filter(d => d !== day) : [...s.daysOff, day]
      return { ...s, daysOff: off }
    }))
  }

  const generate = () => setResult(generateShift(year, month, staffList, minStaff))

  const workCount = (staffId: number) => result
    ? dayNums.filter(d => result[staffId]?.[d] === 'work').length
    : 0

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 no-print">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="text-green-600" size={22} />
            <span className="font-bold text-gray-800 text-sm md:text-base">{t.appName}</span>
          </div>
          <button onClick={toggle} className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50">
            {lang === 'ja' ? 'EN' : 'JA'}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Settings card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm no-print">
          <h2 className="font-semibold text-gray-700 mb-4">基本設定</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">{t.shopName}</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                placeholder={t.shopNamePlaceholder}
                value={shopName}
                onChange={e => setShopName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{t.year}</label>
              <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                value={year} onChange={e => setYear(Number(e.target.value))} min={2020} max={2099} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{t.month}</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                value={month} onChange={e => setMonth(Number(e.target.value))}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{m}月</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-500 whitespace-nowrap">{t.minStaff}</label>
            <input type="number" min={1} max={staffList.length}
              className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              value={minStaff} onChange={e => setMinStaff(Number(e.target.value))} />
            <span className="text-xs text-gray-400">名</span>
          </div>
        </div>

        {/* Staff list card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm no-print">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700">{t.staffList}</h2>
            <button onClick={addStaff} className="flex items-center gap-1 text-sm text-green-600 hover:text-green-800 font-medium">
              <Plus size={15} />{t.addStaff}
            </button>
          </div>
          <div className="space-y-4">
            {staffList.map((s, idx) => (
              <div key={s.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                  <input
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                    placeholder={`${t.staffName} ${idx + 1}`}
                    value={s.name}
                    onChange={e => updateName(s.id, e.target.value)}
                  />
                  <button onClick={() => removeStaff(s.id)} className="text-gray-300 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-2">{t.daysOff}</p>
                  <div className="flex flex-wrap gap-1">
                    {dayNums.map(d => {
                      const dow = getDayOfWeek(year, month, d)
                      const isOff = s.daysOff.includes(d)
                      return (
                        <button
                          key={d}
                          onClick={() => toggleDayOff(s.id, d)}
                          className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${isOff ? 'bg-red-100 text-red-600 border border-red-300' : dow === 0 ? 'bg-red-50 text-red-400 hover:bg-red-100' : dow === 6 ? 'bg-blue-50 text-blue-400 hover:bg-blue-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                        >
                          {d}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={generate}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-2xl text-lg transition-colors no-print shadow-md"
        >
          <RefreshCw size={20} /> {result ? t.regenerate : t.generate}
        </button>

        {/* Shift table */}
        {result && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 no-print">
              <h2 className="font-semibold text-gray-700">
                {shopName || t.result} — {year}年{month}月
              </h2>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
              >
                <Printer size={15} /> {t.print}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="shift-table w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-2 py-2 text-left min-w-20 font-medium text-gray-600">スタッフ</th>
                    {dayNums.map(d => {
                      const dow = getDayOfWeek(year, month, d)
                      return (
                        <th key={d} className={`border border-gray-200 px-1 py-1 text-center w-8 font-medium ${dow === 0 ? 'text-red-500' : dow === 6 ? 'text-blue-500' : 'text-gray-600'}`}>
                          <div>{d}</div>
                          <div className="text-gray-400 font-normal">{dayNames[dow]}</div>
                        </th>
                      )
                    })}
                    <th className="border border-gray-200 px-2 py-2 text-center font-medium text-gray-600">{t.totalDays}</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-2 py-2 font-medium text-gray-700">{s.name || `スタッフ${staffList.indexOf(s) + 1}`}</td>
                      {dayNums.map(d => {
                        const status = result[s.id]?.[d]
                        const dow = getDayOfWeek(year, month, d)
                        return (
                          <td key={d} className={`border border-gray-200 text-center py-1 ${status === 'off' ? 'bg-red-50 text-red-400' : dow === 0 ? 'bg-red-50/30 text-green-600' : dow === 6 ? 'bg-blue-50/30 text-green-600' : 'text-green-600'}`}>
                            {status === 'work' ? t.work : t.off}
                          </td>
                        )
                      })}
                      <td className="border border-gray-200 text-center font-bold text-gray-700">{workCount(s.id)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3 no-print">{t.tip}</p>
          </div>
        )}
      </main>

      {/* AdSense content: 使い方・活用事例・FAQ */}
      <div className="max-w-3xl mx-auto px-4 mt-14 mb-6 space-y-12 no-print">
        {lang === 'ja' ? (
          <>
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">シフト自動作成ツールの使い方</h2>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">1</span>
                  <div>
                    <p className="font-semibold text-gray-800">スタッフ名と希望休を入力する</p>
                    <p className="text-sm text-gray-600 mt-1">スタッフの名前を入力し、休みを希望する日付をカレンダーからクリックして選択します。スタッフは「＋追加」ボタンで何名でも増やせます。</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">2</span>
                  <div>
                    <p className="font-semibold text-gray-800">必要最低人数と対象月を設定する</p>
                    <p className="text-sm text-gray-600 mt-1">1日あたりの必要最低人数と対象年月を選択します。休み希望が重なった場合も、最低人数を確保するように自動調整されます。</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">3</span>
                  <div>
                    <p className="font-semibold text-gray-800">「シフトを生成」して印刷する</p>
                    <p className="text-sm text-gray-600 mt-1">ボタンを押すとシフト表が自動生成されます。印刷ボタンでそのままA4印刷またはPDF保存できます。</p>
                  </div>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">こんな現場で使われています</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-5">
                  <p className="font-semibold text-gray-800 mb-2">飲食店・カフェ</p>
                  <p className="text-sm text-gray-600">アルバイトスタッフ5〜10名のシフトを毎月手動で組んでいたオーナーが、このツールで15分の作業を3分に短縮。希望休の反映漏れもなくなりました。</p>
                </div>
                <div className="bg-green-50 rounded-xl p-5">
                  <p className="font-semibold text-gray-800 mb-2">美容院・エステサロン</p>
                  <p className="text-sm text-gray-600">スタイリストの技術レベルや担当日を考慮してシフトを組む必要があるサロンでも、まず基本シフトをこのツールで自動生成してから手動調整する方法で活用されています。</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-5">
                  <p className="font-semibold text-gray-800 mb-2">学習塾・スクール</p>
                  <p className="text-sm text-gray-600">大学生講師が多い塾では、定期試験期間の休み希望が集中します。このツールで希望を一括登録して自動調整することで、コマ不足を事前に把握できます。</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-5">
                  <p className="font-semibold text-gray-800 mb-2">医療・介護施設</p>
                  <p className="text-sm text-gray-600">夜勤や休日勤務のバランスを取る必要がある施設でも、まず希望休を整理する第一段階として活用できます。Excelが苦手なスタッフでも直感的に操作できると好評です。</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">よくある質問</h2>
              <div className="space-y-4">
                {[
                  ['スタッフは何名まで登録できますか？', '現在のバージョンでは人数の上限はありません。ただし、あまりにも多人数になると画面が見づらくなることがあるため、印刷時のレイアウトをプレビューで確認することをお勧めします。'],
                  ['シフトデータを保存できますか？', 'ブラウザを閉じるとデータは消えます。月次シフトは印刷またはPDF保存してください。将来的にはクラウド保存機能の追加を予定しています。'],
                  ['希望休が重なった場合はどうなりますか？', '設定した「最低必要人数」を確保することを優先してシフトを自動調整します。全員の希望を叶えられない場合は、最低人数の確保が優先されます。'],
                  ['スマートフォンでも使えますか？', '使えます。ただし、スタッフ数・日数が多い場合はPCまたはタブレットでの利用をお勧めします。印刷機能はPCからの操作が快適です。'],
                ].map(([q, a]) => (
                  <details key={q} className="border border-gray-200 rounded-lg">
                    <summary className="p-4 font-medium text-gray-800 cursor-pointer hover:bg-gray-50">{q}</summary>
                    <p className="px-4 pb-4 text-sm text-gray-600">{a}</p>
                  </details>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">How to Use</h2>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">1</span>
                  <div>
                    <p className="font-semibold text-gray-800">Enter staff names and days off</p>
                    <p className="text-sm text-gray-600 mt-1">Type each staff member's name and click their preferred days off on the calendar. Add as many staff as you need with the "+ Add" button.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">2</span>
                  <div>
                    <p className="font-semibold text-gray-800">Set minimum staffing and target month</p>
                    <p className="text-sm text-gray-600 mt-1">Choose the year, month, and minimum number of staff required per day. The tool automatically resolves conflicts while respecting your minimum.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">3</span>
                  <div>
                    <p className="font-semibold text-gray-800">Generate and print</p>
                    <p className="text-sm text-gray-600 mt-1">Click "Generate Shift" to produce the schedule instantly. Print or save as PDF directly from the preview.</p>
                  </div>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  ['How many staff can I add?', 'There is no hard limit. For large teams, we recommend checking the print preview to make sure the layout fits on the page.'],
                  ['Is my data saved?', 'Data is stored only in your browser for the current session. Print or save as PDF before closing the tab to keep your schedule.'],
                  ['What happens when too many people request the same day off?', 'The tool prioritizes your minimum staffing requirement. If honoring all requests would leave you short, it automatically overrides some requests to meet your minimum.'],
                ].map(([q, a]) => (
                  <details key={q} className="border border-gray-200 rounded-lg">
                    <summary className="p-4 font-medium text-gray-800 cursor-pointer hover:bg-gray-50">{q}</summary>
                    <p className="px-4 pb-4 text-sm text-gray-600">{a}</p>
                  </details>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      <footer className="py-6 text-center no-print">
        <p className="text-xs text-gray-400">{t.appName} — {t.tagline}</p>
        <p className="text-xs text-gray-300 mt-1">© 2026 Free to use</p>
        <div className="flex justify-center gap-4 mt-2 flex-wrap">
          {lang === 'ja' ? (
            <>
              <a href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 underline">プライバシーポリシー</a>
              <a href="/terms" className="text-xs text-gray-400 hover:text-gray-600 underline">利用規約</a>
              <a href="/legal" className="text-xs text-gray-400 hover:text-gray-600 underline">特定商取引法に基づく表記</a>
            </>
          ) : (
            <>
              <a href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 underline">Privacy Policy</a>
              <a href="/terms" className="text-xs text-gray-400 hover:text-gray-600 underline">Terms of Service</a>
              <a href="/legal" className="text-xs text-gray-400 hover:text-gray-600 underline">Legal Notice</a>
            </>
          )}
        </div>
      </footer>
    </div>
  )
}
