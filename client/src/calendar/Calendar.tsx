import React from 'react';
import { useTable } from 'react-table'

function Calendar() {
  const timeRange = [8, 20]
  const timeField = Array.from({length: timeRange[1] - timeRange[0]},
     (_, i) => timeRange[0] + i)
  console.log({timeField})  
     interface ColItem {
       [key: string]: {
        startTime: number,
        endTime: number,
        title: string 
       }
     }

  const data = React.useMemo<ColItem[]>(() => [
    {
      col1: {        
        startTime: Date.now(),
        endTime: Date.now() + 200,
        title: 'Test 1'
      }
    },
    {
      col1: {        
        startTime: Date.now(),
        endTime: Date.now() + 200,
        title: 'Test 2'
      }      
    },
    {
      col1: { 
        startTime: Date.now(),
        endTime: Date.now() + 200,
        title: 'Test 3'
      }      
    },
  ], [])

  const columns = React.useMemo(
    () => [
    {
      Header: 'Time',
      accessor: 'col1'
    },
  ], [])



  const tableInstance = useTable({columns, data})

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = tableInstance
     return (
    <div className="App">
      hello world
      <table {...getTableProps}>
        <thead>
          {
            headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}> 
            {
              headerGroup.headers.map(col => (
                <th {...col.getHeaderProps()}>
                  {col.render('Header')}
                </th>
              ))
            }
          </tr>
            ))
          }
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell =>  (
                    <td {...cell.getCellProps()}>
                      {
                        cell.render('Cell')
                      }
                    </td>
                  )
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Calendar;
