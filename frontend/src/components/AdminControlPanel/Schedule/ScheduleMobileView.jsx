import React from 'react';

export default function ScheduleMobileView({ table, getDayFaroese, formatDay, datesArr }) {
  return (
    <div className="table md:hidden w-full mt-10 md:w-9/12 lg:w-8/12 mb-10" dir="rtl">
      {table ? (
        datesArr.map((e, i) => {
          return (
            <div key={i} className="text-2xl w-7/12 mt-3 mx-auto rounded bg-tran">
              <div className="font-bold" key={i}>
                <div className="border-b-2" key={i}>
                  {getDayFaroese(datesArr[i])}{' '}
                  <span className="block text-sm font-normal break-words">
                    {formatDay(datesArr[i])}
                  </span>
                </div>
              </div>
              {table[i].morning.map((employee) => {
                return (
                  <div key={employee._id} className="font-semibold text-lg">
                    <p key={employee._id}>{employee.username}</p>
                  </div>
                );
              })}
              {table[i].middle.map((employee) => {
                return (
                  <div key={employee._id} className="font-semibold text-lg">
                    <p key={employee._id}>
                      {employee.username}
                      <span className="font-semibold text-xs"> (Miðja)</span>
                    </p>
                  </div>
                );
              })}
              {table[i].evening.map((employee) => {
                return (
                  <div key={employee._id} className="font-semibold text-lg">
                    <p key={employee._id}>
                      {employee.username}
                      <span className="font-semibold text-xs"> (Kvøld)</span>
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })
      ) : (
        <h3 className="text-center text-lg">Trýst á "Ger skema" fyri at gera eina nýggja arbeiðsætlan.</h3>
      )}
    </div>
  );
}
