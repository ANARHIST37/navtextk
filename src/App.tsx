import { useState } from 'react';

type Method = 'oncalcwidth' | 'onprintcolumnheader' | 'delphi-code' | 'onbeforeprint';

export default function App() {
  const [activeMethod, setActiveMethod] = useState<Method>('oncalcwidth');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const methods: { id: Method; title: string; icon: string; recommended?: boolean }[] = [
    { id: 'oncalcwidth', title: 'OnCalcWidth', icon: '📏', recommended: true },
    { id: 'onprintcolumnheader', title: 'OnPrintColumnHeader', icon: '🖨️' },
    { id: 'delphi-code', title: 'Из кода Delphi', icon: '🔧' },
    { id: 'onbeforeprint', title: 'OnBeforePrint', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/20">
            FR
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">FastReport 6 VCL</h1>
            <p className="text-xs text-slate-400">Скрытие колонки в CrossTab</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Intro */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Как скрыть колонку в CrossTab
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            В FastReport 6 VCL объект <code className="px-2 py-0.5 rounded bg-slate-700 text-blue-300 text-sm font-mono">CrossTab</code> (или <code className="px-2 py-0.5 rounded bg-slate-700 text-blue-300 text-sm font-mono">DBCrossTab</code>) не имеет прямого свойства <code className="px-2 py-0.5 rounded bg-slate-700 text-red-300 text-sm font-mono">Visible</code> для отдельных колонок. 
            Вместо этого используется несколько подходов через события объекта.
          </p>
        </section>

        {/* Method tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveMethod(m.id)}
              className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                activeMethod === m.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.title}</span>
              {m.recommended && (
                <span className="px-1.5 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                  рекомендуется
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Method 1: OnCalcWidth */}
          {activeMethod === 'oncalcwidth' && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📏</span>
                  <h3 className="text-xl font-bold text-white">Способ 1: Событие OnCalcWidth (рекомендуется)</h3>
                </div>
                <p className="text-slate-300 mb-4">
                  Самый надёжный способ — установить ширину колонки в <code className="px-1.5 py-0.5 rounded bg-slate-700 text-yellow-300 text-sm font-mono">0</code> в обработчике события <code className="px-1.5 py-0.5 rounded bg-slate-700 text-blue-300 text-sm font-mono">OnCalcWidth</code>. 
                  Это событие вызывается перед расчётом ширины каждой колонки.
                </p>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
                  <p className="text-amber-200 text-sm flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <span><strong>Важно:</strong> Итоговые значения (Totals) не пересчитываются при скрытии колонки, т.к. таблица уже заполнена данными к моменту вызова события.</span>
                  </p>
                </div>
              </div>

              {/* Pascal Script */}
              <CodeBlock
                id="calcwidth-pascal"
                title="Pascal Script (внутри отчёта)"
                language="pascal"
                copiedId={copiedId}
                onCopy={copyToClipboard}
                code={`procedure Cross1OnCalcWidth(ColumnIndex: Integer;
  ColumnValues: Variant; var Width: Extended);
begin
  // Скрыть колонку по индексу (нумерация с 0)
  if ColumnIndex = 2 then
    Width := 0;

  // Или скрыть по значению заголовка
  // if (VarToStr(ColumnValues[0]) = '2024') and
  //    (VarToStr(ColumnValues[1]) = '03') then
  //   Width := 0;
end;`}
              />

              {/* C++ Script */}
              <CodeBlock
                id="calcwidth-cpp"
                title="C++ Script"
                language="cpp"
                copiedId={copiedId}
                onCopy={copyToClipboard}
                code={`void Cross1OnCalcWidth(int ColumnIndex,
  Variant ColumnValues, Extended &Width)
{
  if (ColumnIndex == 2)
    Width = 0;
}`}
              />
            </div>
          )}

          {/* Method 2: OnPrintColumnHeader */}
          {activeMethod === 'onprintcolumnheader' && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🖨️</span>
                  <h3 className="text-xl font-bold text-white">Способ 2: Событие OnPrintColumnHeader</h3>
                </div>
                <p className="text-slate-300 mb-4">
                  Альтернативный способ — скрыть заголовок колонки через событие <code className="px-1.5 py-0.5 rounded bg-slate-700 text-blue-300 text-sm font-mono">OnPrintColumnHeader</code>. 
                  Подходит для DB CrossTab, когда нужно скрыть колонку по значению заголовка.
                </p>
              </div>

              <CodeBlock
                id="printcol-pascal"
                title="Pascal Script"
                language="pascal"
                copiedId={copiedId}
                onCopy={copyToClipboard}
                code={`procedure DBCross1OnPrintColumnHeader(Memo: TfrxMemoView;
  HeaderIndexes, HeaderValues, Value: Variant);
begin
  if VarToStr(HeaderValues[0]) = '14001' then
  begin
    Memo.Width := 0;
    Memo.Height := 0;
    Memo.Visible := False;
    Memo.Printable := False;
  end;
end;`}
              />

              <CodeBlock
                id="printcol-by-index"
                title="Скрытие по индексу заголовка"
                language="pascal"
                copiedId={copiedId}
                onCopy={copyToClipboard}
                code={`procedure Cross1OnPrintColumnHeader(Memo: TfrxMemoView;
  HeaderIndexes, HeaderValues, Value: Variant);
begin
  // HeaderIndexes[0] - индекс на верхнем уровне
  // HeaderIndexes[1] - индекс на следующем уровне
  if (HeaderIndexes[0] = 0) and (HeaderIndexes[1] = 2) then
  begin
    Memo.Visible := False;
    Memo.Width := 0;
  end;
end;`}
              />
            </div>
          )}

          {/* Method 3: From Delphi code */}
          {activeMethod === 'delphi-code' && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🔧</span>
                  <h3 className="text-xl font-bold text-white">Способ 3: Из кода Delphi (runtime)</h3>
                </div>
                <p className="text-slate-300 mb-4">
                  Если нужно управлять видимостью колонок из кода приложения (не из скрипта отчёта), 
                  назначьте обработчик события программно.
                </p>
              </div>

              <CodeBlock
                id="delphi-event"
                title="Назначение обработчика в Delphi"
                language="delphi"
                copiedId={copiedId}
                onCopy={copyToClipboard}
                code={`// В форме назначаем обработчик перед генерацией отчёта
procedure TForm1.btnPrintClick(Sender: TObject);
var
  Cross: TfrxCrossTabView;
begin
  // Находим объект CrossTab в отчёте
  Cross := TfrxCrossTabView(
    frxReport1.FindObject('Cross1'));
  
  if Cross <> nil then
    Cross.OnCalcWidth := @CrossCalcWidth;
  
  frxReport1.ShowReport;
end;

// Обработчик события
procedure TForm1.CrossCalcWidth(
  ColumnIndex: Integer;
  ColumnValues: Variant;
  var Width: Extended);
begin
  // Скрыть колонку с индексом 2
  if ColumnIndex = 2 then
    Width := 0;
end;`}
              />

              <CodeBlock
                id="delphi-hide-all"
                title="Скрытие нескольких колонок по условию"
                language="delphi"
                copiedId={copiedId}
                onCopy={copyToClipboard}
                code={`procedure TForm1.CrossCalcWidth(
  ColumnIndex: Integer;
  ColumnValues: Variant;
  var Width: Extended);
var
  colName: string;
begin
  colName := VarToStr(ColumnValues[0]);
  
  // Скрыть колонки из списка
  if (colName = 'КолонкаA') or 
     (colName = 'КолонкаB') then
    Width := 0;
end;`}
              />
            </div>
          )}

          {/* Method 4: OnBeforePrint */}
          {activeMethod === 'onbeforeprint' && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">⚡</span>
                  <h3 className="text-xl font-bold text-white">Способ 4: Событие OnBeforePrint</h3>
                </div>
                <p className="text-slate-300 mb-4">
                  Событие <code className="px-1.5 py-0.5 rounded bg-slate-700 text-blue-300 text-sm font-mono">OnBeforePrint</code> вызывается перед печатью всей таблицы. 
                  Здесь можно использовать методы CrossTab для анализа структуры.
                </p>
              </div>

              <CodeBlock
                id="beforeprint-pascal"
                title="Pascal Script — использование методов CrossTab"
                language="pascal"
                copiedId={copiedId}
                onCopy={copyToClipboard}
                code={`procedure Cross1OnBeforePrint(Sender: TfrxComponent);
var
  i: Integer;
begin
  // Доступные методы CrossTab:
  // ColCount - количество колонок
  // RowCount - количество строк
  // IsGrandTotalColumn(Index) - колонка является итогом
  // IsTotalColumn(Index) - колонка является подитогом
  
  // Пример: скрыть последнюю колонку
  // (через OnCalcWidth, вызываемый после OnBeforePrint)
end;

// Основная логика скрытия — в OnCalcWidth
procedure Cross1OnCalcWidth(ColumnIndex: Integer;
  ColumnValues: Variant; var Width: Extended);
begin
  // Скрыть все итоговые колонки
  // if Cross1.IsGrandTotalColumn(ColumnIndex) then
  //   Width := 0;
  
  // Скрыть колонку по индексу
  if ColumnIndex = 3 then
    Width := 0;
end;`}
              />

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-3">Доступные методы CrossTab в скрипте:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-2 px-3 text-slate-400 font-medium">Метод</th>
                        <th className="text-left py-2 px-3 text-slate-400 font-medium">Описание</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      <tr className="border-b border-slate-700/50">
                        <td className="py-2 px-3 font-mono text-blue-300">ColCount</td>
                        <td className="py-2 px-3">Возвращает количество колонок</td>
                      </tr>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-2 px-3 font-mono text-blue-300">RowCount</td>
                        <td className="py-2 px-3">Возвращает количество строк</td>
                      </tr>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-2 px-3 font-mono text-blue-300">IsGrandTotalColumn(Index)</td>
                        <td className="py-2 px-3">True, если колонка — общий итог</td>
                      </tr>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-2 px-3 font-mono text-blue-300">IsTotalColumn(Index)</td>
                        <td className="py-2 px-3">True, если колонка — подитог</td>
                      </tr>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-2 px-3 font-mono text-blue-300">IsGrandTotalRow(Index)</td>
                        <td className="py-2 px-3">True, если строка — общий итог</td>
                      </tr>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-2 px-3 font-mono text-blue-300">IsTotalRow(Index)</td>
                        <td className="py-2 px-3">True, если строка — подитог</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono text-blue-300">AddValue(...)</td>
                        <td className="py-2 px-3">Добавить значение в таблицу</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Summary table */}
          <section className="mt-10 bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📋</span> Сводная таблица событий CrossTab
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-3 px-3 text-slate-400 font-medium">Событие</th>
                    <th className="text-left py-3 px-3 text-slate-400 font-medium">Когда вызывается</th>
                    <th className="text-left py-3 px-3 text-slate-400 font-medium">Для скрытия</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-700/50 bg-green-500/5">
                    <td className="py-3 px-3 font-mono text-green-300 font-medium">OnCalcWidth</td>
                    <td className="py-3 px-3">Перед расчётом ширины колонки</td>
                    <td className="py-3 px-3">Установить <code className="text-yellow-300">Width := 0</code></td>
                  </tr>
                  <tr className="border-b border-slate-700/50">
                    <td className="py-3 px-3 font-mono text-blue-300">OnCalcHeight</td>
                    <td className="py-3 px-3">Перед расчётом высоты строки</td>
                    <td className="py-3 px-3">Установить <code className="text-yellow-300">Height := 0</code></td>
                  </tr>
                  <tr className="border-b border-slate-700/50">
                    <td className="py-3 px-3 font-mono text-blue-300">OnPrintColumnHeader</td>
                    <td className="py-3 px-3">Перед выводом заголовка колонки</td>
                    <td className="py-3 px-3">Memo.Visible := False</td>
                  </tr>
                  <tr className="border-b border-slate-700/50">
                    <td className="py-3 px-3 font-mono text-blue-300">OnPrintRowHeader</td>
                    <td className="py-3 px-3">Перед выводом заголовка строки</td>
                    <td className="py-3 px-3">Memo.Visible := False</td>
                  </tr>
                  <tr className="border-b border-slate-700/50">
                    <td className="py-3 px-3 font-mono text-blue-300">OnPrintCell</td>
                    <td className="py-3 px-3">Перед выводом ячейки данных</td>
                    <td className="py-3 px-3">Изменить дизайн/содержимое</td>
                  </tr>
                  <tr className="border-b border-slate-700/50">
                    <td className="py-3 px-3 font-mono text-blue-300">OnBeforePrint</td>
                    <td className="py-3 px-3">Перед печатью таблицы</td>
                    <td className="py-3 px-3">Подготовка данных</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono text-blue-300">OnAfterPrint</td>
                    <td className="py-3 px-3">После печати таблицы</td>
                    <td className="py-3 px-3">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Tips */}
          <section className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span>💡</span> Полезные советы
            </h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Используйте <code className="px-1.5 py-0.5 rounded bg-slate-700 text-yellow-300 text-xs font-mono">VarToStr()</code> при сравнении значений заголовков — FastReport автоматически пытается преобразовать строки в числа, что может вызвать ошибки с «Итого» и «Общий итог».</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Нумерация колонок и строк начинается с <code className="px-1.5 py-0.5 rounded bg-slate-700 text-yellow-300 text-xs font-mono">0</code>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Параметры <code className="px-1.5 py-0.5 rounded bg-slate-700 text-yellow-300 text-xs font-mono">ColumnValues</code> и <code className="px-1.5 py-0.5 rounded bg-slate-700 text-yellow-300 text-xs font-mono">HeaderValues</code> — массивы Variant с нулевой базой. Элемент [0] — верхний уровень заголовка, [1] — следующий уровень и т.д.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Для DB CrossTab используйте компонент <code className="px-1.5 py-0.5 rounded bg-slate-700 text-blue-300 text-xs font-mono">TfrxDBCrossTabView</code>, для обычного — <code className="px-1.5 py-0.5 rounded bg-slate-700 text-blue-300 text-xs font-mono">TfrxCrossTabView</code>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Если нужно скрыть колонку <strong>полностью</strong> (и данные, и заголовок), используйте <code className="px-1.5 py-0.5 rounded bg-slate-700 text-green-300 text-xs font-mono">OnCalcWidth</code> с <code className="px-1.5 py-0.5 rounded bg-slate-700 text-yellow-300 text-xs font-mono">Width := 0</code>.</span>
              </li>
            </ul>
          </section>

          {/* Links */}
          <section className="mt-8 text-center text-sm text-slate-500 pb-8">
            <p>
              Документация:{' '}
              <a href="https://www.fast-report.com/public_download/docs/FRVCL/online/en/FastReportVCL/UserManual/en-US/Cross_tab_reports/Managing_a_cross-table_from_the_script.html" 
                 target="_blank" rel="noopener noreferrer"
                 className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                FastReport VCL — Managing a cross-tab in script
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

function CodeBlock({ 
  id, title, language, code, copiedId, onCopy 
}: { 
  id: string; 
  title: string; 
  language: string; 
  code: string; 
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  return (
    <div className="bg-slate-800/80 border border-slate-700/50 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-700/30 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{language}</span>
          <span className="text-slate-600">—</span>
          <span className="text-sm text-slate-300">{title}</span>
        </div>
        <button
          onClick={() => onCopy(code, id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 bg-slate-600/50 hover:bg-slate-600 text-slate-300 hover:text-white"
        >
          {copiedId === id ? (
            <>
              <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-400">Скопировано!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Копировать</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="text-slate-200 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}
