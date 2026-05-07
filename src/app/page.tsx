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

      <footer className="py-6 text-center no-print">
        <p className="text-xs text-gray-400">{t.appName} — {t.tagline}</p>
      </footer>
    </div>
  )
}
