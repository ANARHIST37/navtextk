import { useState } from 'react';

type Method = 'script' | 'delphi';

export default function App() {
  const [activeMethod, setActiveMethod] = useState<Method>('script');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const methods: { id: Method; title: string; icon: string }[] = [
    { id: 'script', title: 'Скрипт отчёта (PascalScript)', icon: '📝' },
    { id: 'delphi', title: 'Из кода Delphi', icon: '🔧' },
  ];

  // Код для скрипта отчёта
  const scriptCode = `procedure DBCross1OnPrintRowHeader(Memo: TfrxMemoView;
  HeaderIndexes, HeaderValues, Value: Variant);
begin
  // HeaderIndexes[0] — индекс уровня строки:
  //   0 = SHOP_NAME
  //   1 = ROW_ORDER   ← скрываем
  //   2 = METRIC_NAME
  if HeaderIndexes[0] = 1 then
  begin
    Memo.Visible := False;
    Memo.Width := 0;
  end;
end;

procedure DBCross1OnPrintCell(Memo: TfrxMemoView;
  RowIndex, ColumnIndex, CellIndex: Integer;
  RowValues, ColumnValues, Value: Variant);
begin
  // CellIndex — индекс поля строки:
  //   0 = SHOP_NAME
  //   1 = ROW_ORDER   ← скрываем
  //   2 = METRIC_NAME
  if CellIndex = 1 then
  begin
    Memo.Visible := False;
    Memo.Width := 0;
  end;
end;`;

  // Код для Delphi
  const delphiCode = `// В форме, перед генерацией отчёта:
procedure TForm1.btnPrintClick(Sender: TObject);
var
  DBCross: TfrxDBCrossView;
begin
  DBCross := TfrxDBCrossView(
    frxReport1.FindObject('DBCross1'));

  if DBCross <> nil then
  begin
    DBCross.OnPrintRowHeader := @DBCrossPrintRowHeader;
    DBCross.OnPrintCell := @DBCrossPrintCell;
  end;

  frxReport1.ShowReport;
end;

// Обработчик заголовков строк
procedure TForm1.DBCrossPrintRowHeader(
  Memo: TfrxMemoView;
  HeaderIndexes, HeaderValues, Value: Variant);
begin
  // Скрыть уровень ROW_ORDER (индекс 1)
  if HeaderIndexes[0] = 1 then
  begin
    Memo.Visible := False;
    Memo.Width := 0;
  end;
end;

// Обработчик ячеек
procedure TForm1.DBCrossPrintCell(
  Memo: TfrxMemoView;
  RowIndex, ColumnIndex, CellIndex: Integer;
  RowValues, ColumnValues, Value: Variant);
begin
  // Скрыть ячейки ROW_ORDER (индекс 1)
  if CellIndex = 1 then
  begin
    Memo.Visible := False;
    Memo.Width := 0;
  end;
end;`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/20">
            FR
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">FastReport 6 VCL — DBCross1</h1>
            <p className="text-xs text-slate-400">Скрытие поля ROW_ORDER в кросстаблице</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Structure */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Структура вашего DBCross1
          </h2>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Row Fields */}
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-400 mb-3 uppercase tracking-wide">RowFields (строки)</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded bg-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-300">0</span>
                    <span className="text-slate-200 font-mono">SHOP_NAME</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-red-500/10 border border-red-500/30 rounded px-2 py-1.5">
                    <span className="w-5 h-5 rounded bg-red-500/30 flex items-center justify-center text-[10px] font-bold text-red-300">1</span>
                    <span className="text-red-300 font-mono font-bold">ROW_ORDER</span>
                    <span className="text-[10px] text-red-400 ml-auto">скрыть</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded bg-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-300">2</span>
                    <span className="text-slate-200 font-mono">METRIC_NAME</span>
                  </div>
                </div>
              </div>

              {/* Column Fields */}
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-green-400 mb-3 uppercase tracking-wide">ColumnFields (колонки)</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded bg-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-300">0</span>
                    <span className="text-slate-200 font-mono">DAY_NUM</span>
                  </div>
                </div>
              </div>

              {/* Cell Fields */}
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-yellow-400 mb-3 uppercase tracking-wide">CellFields (ячейки)</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded bg-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-300">0</span>
                    <span className="text-slate-200 font-mono">METRIC_VALUE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual table */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h4 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wide">Как выглядит таблица (визуально):</h4>
            <div className="overflow-x-auto">
              <table className="text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="border border-slate-600 bg-slate-700/50 px-3 py-2 text-slate-300" rowSpan={2}>SHOP_NAME</th>
                    <th className="border border-red-500/50 bg-red-500/10 px-3 py-2 text-red-300 font-bold" rowSpan={2}>
                      ROW_ORDER
                      <span className="block text-[9px] text-red-400 font-normal mt-0.5">← скрыть</span>
                    </th>
                    <th className="border border-slate-600 bg-slate-700/50 px-3 py-2 text-slate-300" rowSpan={2}>METRIC_NAME</th>
                    <th className="border border-slate-600 bg-slate-700/50 px-3 py-2 text-slate-300 text-center" colSpan={3}>DAY_NUM</th>
                  </tr>
                  <tr>
                    <th className="border border-slate-600 bg-slate-700/30 px-3 py-1.5 text-slate-400">1</th>
                    <th className="border border-slate-600 bg-slate-700/30 px-3 py-1.5 text-slate-400">2</th>
                    <th className="border border-slate-600 bg-slate-700/30 px-3 py-1.5 text-slate-400">...</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-600 bg-slate-700/20 px-3 py-1.5 text-slate-300">Магазин А</td>
                    <td className="border border-red-500/30 bg-red-500/5 px-3 py-1.5 text-red-300/70 line-through">1</td>
                    <td className="border border-slate-600 bg-slate-700/20 px-3 py-1.5 text-slate-300">Выручка</td>
                    <td className="border border-slate-600 bg-slate-700/10 px-3 py-1.5 text-slate-400 text-center">100</td>
                    <td className="border border-slate-600 bg-slate-700/10 px-3 py-1.5 text-slate-400 text-center">200</td>
                    <td className="border border-slate-600 bg-slate-700/10 px-3 py-1.5 text-slate-400 text-center">...</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-600 bg-slate-700/20 px-3 py-1.5 text-slate-300">Магазин А</td>
                    <td className="border border-red-500/30 bg-red-500/5 px-3 py-1.5 text-red-300/70 line-through">2</td>
                    <td className="border border-slate-600 bg-slate-700/20 px-3 py-1.5 text-slate-300">Трафик</td>
                    <td className="border border-slate-600 bg-slate-700/10 px-3 py-1.5 text-slate-400 text-center">50</td>
                    <td className="border border-slate-600 bg-slate-700/10 px-3 py-1.5 text-slate-400 text-center">60</td>
                    <td className="border border-slate-600 bg-slate-700/10 px-3 py-1.5 text-slate-400 text-center">...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Решение
          </h2>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 mb-6">
            <p className="text-green-200 text-sm flex items-start gap-2">
              <span className="text-lg">✅</span>
              <span>
                <code className="font-mono text-green-300">ROW_ORDER</code> — это второй уровень строк (<strong>индекс 1</strong>). 
                Чтобы скрыть его, нужно обработать два события: <code className="font-mono text-blue-300">OnPrintRowHeader</code> (заголовки) 
                и <code className="font-mono text-blue-300">OnPrintCell</code> (ячейки данных строк).
              </span>
            </p>
          </div>

          {/* Tabs */}
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
              </button>
            ))}
          </div>

          {/* Script tab */}
          {activeMethod === 'script' && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h4 className="text-base font-semibold text-white mb-2">Инструкция:</h4>
                <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                  <li>Откройте отчёт в дизайнере FastReport</li>
                  <li>Выделите объект <code className="px-1.5 py-0.5 rounded bg-slate-700 text-green-300 text-xs font-mono">DBCross1</code></li>
                  <li>В инспекторе объектов перейдите на вкладку <strong>Events</strong></li>
                  <li>Дважды кликните по событию <code className="px-1.5 py-0.5 rounded bg-slate-700 text-blue-300 text-xs font-mono">OnPrintRowHeader</code></li>
                  <li>Добавьте код для <code className="px-1.5 py-0.5 rounded bg-slate-700 text-blue-300 text-xs font-mono">OnPrintRowHeader</code> и <code className="px-1.5 py-0.5 rounded bg-slate-700 text-blue-300 text-xs font-mono">OnPrintCell</code></li>
                </ol>
              </div>

              <CodeBlock
                id="script-main"
                title="Скрипт отчёта — PascalScript"
                language="pascal"
                copiedId={copiedId}
                onCopy={copyToClipboard}
                code={scriptCode}
              />
            </div>
          )}

          {/* Delphi tab */}
          {activeMethod === 'delphi' && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h4 className="text-base font-semibold text-white mb-2">Инструкция:</h4>
                <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                  <li>Найдите объект <code className="px-1.5 py-0.5 rounded bg-slate-700 text-green-300 text-xs font-mono">DBCross1</code> в отчёте через <code className="px-1.5 py-0.5 rounded bg-slate-700 text-blue-300 text-xs font-mono">FindObject</code></li>
                  <li>Назначьте обработчики событий программно</li>
                  <li>Вызовите <code className="px-1.5 py-0.5 rounded bg-slate-700 text-blue-300 text-xs font-mono">ShowReport</code> или <code className="px-1.5 py-0.5 rounded bg-slate-700 text-blue-300 text-xs font-mono">PrepareReport</code></li>
                </ol>
              </div>

              <CodeBlock
                id="delphi-main"
                title="Код Delphi"
                language="delphi"
                copiedId={copiedId}
                onCopy={copyToClipboard}
                code={delphiCode}
              />
            </div>
          )}
        </section>

        {/* Explanation */}
        <section className="mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>🔍</span> Как это работает
            </h3>
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0">1</span>
                <div>
                  <p className="font-semibold text-white mb-1">OnPrintRowHeader</p>
                  <p>Вызывается для каждой ячейки заголовка строки. Параметр <code className="px-1.5 py-0.5 rounded bg-slate-700 text-yellow-300 text-xs font-mono">HeaderIndexes[0]</code> содержит индекс уровня строки. Для <code className="text-red-300">ROW_ORDER</code> это <strong>1</strong>.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0">2</span>
                <div>
                  <p className="font-semibold text-white mb-1">OnPrintCell</p>
                  <p>Вызывается для каждой ячейки в области строк (левая часть таблицы). Параметр <code className="px-1.5 py-0.5 rounded bg-slate-700 text-yellow-300 text-xs font-mono">CellIndex</code> содержит индекс поля строки. Для <code className="text-red-300">ROW_ORDER</code> это тоже <strong>1</strong>.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-xs shrink-0">✓</span>
                <div>
                  <p className="font-semibold text-white mb-1">Результат</p>
                  <p>Установка <code className="px-1.5 py-0.5 rounded bg-slate-700 text-yellow-300 text-xs font-mono">Visible := False</code> и <code className="px-1.5 py-0.5 rounded bg-slate-700 text-yellow-300 text-xs font-mono">Width := 0</code> полностью убирает колонку <code className="text-red-300">ROW_ORDER</code> из вывода.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important notes */}
        <section className="mb-8">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
            <h4 className="text-base font-semibold text-amber-200 mb-3 flex items-center gap-2">
              <span>⚠️</span> Важные замечания
            </h4>
            <ul className="space-y-2 text-sm text-amber-100/80">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>Оба обработчика (<code className="font-mono text-amber-300">OnPrintRowHeader</code> и <code className="font-mono text-amber-300">OnPrintCell</code>) нужны для полного скрытия — первый убирает заголовки, второй — данные.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>Нумерация уровней строк начинается с <strong>0</strong>: SHOP_NAME=0, ROW_ORDER=1, METRIC_NAME=2.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>Если нужно скрыть поле по условию (например, только для определённых магазинов), добавьте проверку значения через <code className="font-mono text-amber-300">HeaderValues</code> или <code className="font-mono text-amber-300">RowValues</code>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>Тип объекта в файле: <code className="font-mono text-amber-300">TfrxDBCrossView</code> (класс в Delphi).</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Conditional example */}
        <section className="mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>💡</span> Бонус: Скрытие по условию
            </h3>
            <p className="text-sm text-slate-300 mb-4">Если нужно скрывать ROW_ORDER только при определённых условиях:</p>
            <CodeBlock
              id="conditional"
              title="Условное скрытие"
              language="pascal"
              copiedId={copiedId}
              onCopy={copyToClipboard}
              code={`procedure DBCross1OnPrintRowHeader(Memo: TfrxMemoView;
  HeaderIndexes, HeaderValues, Value: Variant);
begin
  if HeaderIndexes[0] = 1 then  // ROW_ORDER
  begin
    // Пример: скрыть если значение = '0'
    // if VarToStr(HeaderValues[0]) = '0' then
    // begin
    //   Memo.Visible := False;
    //   Memo.Width := 0;
    // end;

    // Или скрыть всегда:
    Memo.Visible := False;
    Memo.Width := 0;
  end;
end;`}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-slate-500 pb-8 pt-4 border-t border-slate-700/30">
          <p>
            FastReport 6 VCL • DBCross1 • Отчёт: PressReport • DataSet: frxDSPressReport
          </p>
        </footer>
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
