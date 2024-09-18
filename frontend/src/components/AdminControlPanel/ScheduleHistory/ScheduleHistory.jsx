import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import HashLoader from 'react-spinners/HashLoader';
import { useUserContext } from '../../useUserContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FcCancel, FcCalendar, FcManager, FcAlarmClock } from 'react-icons/fc';
import { RiHashtag } from 'react-icons/ri';
import Swal from 'sweetalert2';
import ScheduleHistoryModal from './ScheduleHistoryModal';
import ShiftID from './ShiftID';

const ScheduleHistory = () => {
  const { user } = useUserContext();
  const [shifts, setShifts] = useState([]);

  let navigate = useNavigate();

  const refreshShifts = async () => {
    const response = await axios.get('/getScheduleHistory');
    setShifts(response.data);
  };

  useEffect(() => {
    refreshShifts();
  }, []);

  switch (true) {
    case !user:
      return (
        <>
          <div className="grid w-screen h-screen place-items-center">
            <HashLoader className="content-center" size={100} />
            <h3>Løðir, vinarliga bíða...</h3>
          </div>
        </>
      );
    case user && user.admin === false && user.isAuthenticated === true:
      navigate('/');
      break;
    case user && user.isAuthenticated === false:
      navigate('/login');
      break;
    default:
      break;
  }

  const handleRemove = async (e, id) => {
    e.preventDefault();

    Swal.fire({
      title: 'Halda fram?',
      text: 'Tað ber ikki til at endurstovna eina strikað vakt',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Ógilda',
      confirmButtonText: 'Ja, strika vakt',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post('/removeSchedule', { id });
        refreshShifts();
        Swal.fire('Vakt strikað!', 'Vaktin er strikað', 'success');
      }
    });
  };

  return (
    <>
      <Navbar />
      <div>
        <div className="grid mt-5 place-items-center" dir="rtl">
          <div className="w-11/12 lg:w-4/6">
            <h1 className="text-3xl font-semibold">Arbeiðsætlanir</h1>
            {shifts.length > 0 && (
              <table className="w-full mx-auto my-10 border-separate shadow-sm table-auto md:w-5/6 lg:w-4/6">
                <thead>
                  <tr className="text-xl text-right">
                    <th className="w-1/12">
                      <RiHashtag />
                    </th>
                    <th className="w-4/12">
                      <div className="flex">
                        <FcCalendar className="mx-1 mt-1" />
                        <p className="">Dagfesting</p>
                      </div>
                    </th>
                    <th className="w-4/12">
                      <div className="flex">
                        <FcAlarmClock className="mx-1 mt-1" />
                        Almannakunngjørd
                      </div>
                    </th>
                    <th className="w-2/12">
                      <div className="flex">
                        <FcManager className="mx-1 mt-1" />
                        Av
                      </div>
                    </th>
                    <th className="w-1/12"></th>
                  </tr>
                </thead>
                <tbody>
                  {shifts &&
                    shifts
                      .slice(0)
                      .reverse()
                      .map((shift, i) => {
                        const date = new Date(Date.parse(shift.date));
                        const time = format(date, '(HH:mm) dd-MM-yyyy');
                        const shiftsAmount = shifts.length;
                        return (
                          <tr
                            className="text-lg font-medium text-gray-900 hover:bg-slate-100"
                            key={shift._id}
                          >
                            <td>
                              <ShiftID shift={shift} shiftsAmount={shiftsAmount} currentIndex={i} />
                            </td>
                            <td>
                              <ScheduleHistoryModal
                                shift={shift}
                                shiftsAmount={shiftsAmount}
                                currentIndex={i}
                              />
                            </td>
                            <td>{time}</td>
                            <td>{shift.savedBy}</td>
                            <td>
                              <button className="p-2 " onClick={(e) => handleRemove(e, shift._id)}>
                                <FcCancel className="text-2xl" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            )}
            {shifts.length === 0 && (
              <>
                <div className="text-2xl font-medium text-center my-28">
                  <h1>Ongar vaktir funnar</h1>
                  <h1>Ger eina nýggja arbeiðsætlan</h1>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleHistory;
