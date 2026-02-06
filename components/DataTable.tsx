
import React, { useRef, useState, useEffect } from 'react';
import { PerformanceData } from '../types';

interface DataTableProps {
  headers: string[];
  data: PerformanceData[];
  onFilterChange?: (filtered: PerformanceData[]) => void;
}

const DataTable: React.FC<DataTableProps> = ({ headers, data, onFilterChange }) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const group1Count = 14; 

  const colWidth = 110;
  const colWidthClass = "w-[110px] min-w-[110px] max-w-[110px]";

  // --- LÓGICA DE FILTRAGEM ---
  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Notifica o componente pai sobre a mudança nos dados filtrados
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filteredData);
    }
  }, [searchTerm, data]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToGroup = (startColIndex: number) => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTo({
        left: startColIndex * colWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl shadow-slate-200/60 border border-slate-200 overflow-hidden transition-all duration-300">
      <div className="px-6 py-4 border-b border-slate-100 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div>
            <h3 className="text-[11px] font-black text-slate-800 tracking-tight text-left uppercase">Banco de Dados Ativo</h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase text-left">
              {filteredData.length} de {data.length} registros visíveis
            </p>
          </div>

          {/* BARRA DE PESQUISA INTEGRADA */}
          <div className="relative flex-grow md:w-72">
            <input 
              type="text"
              placeholder="PESQUISAR VOOS, DATAS OU PREFIXOS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-[#004181]/20 transition-all placeholder:text-slate-300"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7(7) 0 11-14 0 7(7) 0 0114 0z" /></svg>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
           {[
             { name: "1. Geral", color: "#004181", start: 0 }
           ].map((g, i) => (
             <button 
               key={i}
               onClick={() => scrollToGroup(g.start)}
               className={`flex items-center gap-1.5 px-2 py-1 border rounded hover:opacity-80 transition-opacity cursor-pointer bg-slate-50 border-slate-200 text-slate-700`}
             >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: g.color }}></div>
                <span className="text-[10px] font-black uppercase tracking-tighter">{g.name}</span>
             </button>
           ))}
        </div>
      </div>
      
      <div 
        ref={tableContainerRef}
        className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar"
      >
        <table className="text-center border-collapse table-fixed w-full border-spacing-0">
          <thead className="sticky top-0 z-30">
            <tr className="h-[28px] border-none">
              <th colSpan={headers.length} className="bg-[#004181] text-white px-1 text-[10px] font-black uppercase border-b-0 whitespace-nowrap overflow-hidden text-ellipsis text-center">1. GERAL</th>
            </tr>
            <tr className="bg-slate-50">
              {headers.map((header, idx) => {
                const isG1 = idx < group1Count;
                
                let textColor = "text-slate-500";
                let bgColor = "bg-slate-50";
                
                if (isG1) { textColor = "text-[#004181]"; bgColor = "bg-[#004181]/10"; }

                return (
                  <th 
                    key={idx} 
                    className={`${colWidthClass} px-2 py-1 text-[10px] font-black border-b border-slate-200 whitespace-nowrap sticky top-[28px] ${bgColor} z-20 overflow-hidden text-ellipsis ${textColor} text-center`}
                    title={header}
                  >
                    {header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-200 transition-colors group">
                  {headers.map((header, colIdx) => {
                    const isG1 = colIdx < group1Count;
                    
                    let cellBg = "";
                    if (isG1) cellBg = "bg-[#004181]/5";

                    const value = row[header];
                    const displayValue = value !== undefined && value !== '' ? String(value) : '';

                    return (
                      <td 
                        key={colIdx} 
                        className={`${colWidthClass} px-2 py-1 text-[10px] whitespace-nowrap border-r border-slate-50 last:border-r-0 overflow-hidden text-ellipsis text-center ${cellBg}`}
                        title={displayValue}
                      >
                        <span className="font-bold text-slate-700">
                          {displayValue}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Nenhum registro encontrado para "{searchTerm}"</p>
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="mt-4 text-[9px] font-black text-[#004181] uppercase underline"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
