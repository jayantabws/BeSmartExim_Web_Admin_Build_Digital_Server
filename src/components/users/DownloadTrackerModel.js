import React, { useState, useEffect } from 'react';
import AxiosUser from '../shared/AxiosUser';
import moment from "moment";

const DownloadTrackerModel = ({ rowData }) => {

  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [loginList, setLoginList] = useState([]);

  // ✅ Run when rowData changes
  useEffect(() => {
    if (rowData?.id) {
      fetchData(rowData.id, 0);
      getTotalCount(rowData.id);
    }
  }, [rowData]);

  // ✅ Total Count API
  const getTotalCount = (userId) => {
    let url = `/search-management/search/countAllnew?isDownloaded=Y`;

    if (userId) {
      url += `?userId=${userId}`;
    }

    AxiosUser({ method: "GET", url })
      .then((res) => {
        let count = res.data?.totalCount || res.data || 0;
        setTotalCount(count);
      })
      .catch(() => setTotalCount(0));
  };

  // ✅ Fetch List with Pagination
  const fetchData = (userId, page) => {
    setLoading(true);

    let url = `/user-management/user/listAllnew?pageNumber=${page}&pageSize=${pageSize}&userId=${userId}`;

    AxiosUser({ method: "GET", url })
      .then((res) => {

        let data = res.data?.loginList || res.data || [];

        const formatted = data.map((item, index) => {
          const login = formatDateTime(item.loginDate, item.loginTime);
          const logout = formatDateTime(item.logoutDate, item.logoutTime);

          return {
            ...item,
            id: item.id || index,
            loginDateOnly: login.date,
            loginTimeOnly: login.time,
            logoutDateOnly: logout.date,
            logoutTimeOnly: logout.time,
          };
        });

        setLoginList(formatted);
        setCurrentPage(page);
      })
      .catch(() => setLoginList([]))
      .finally(() => setLoading(false));
  };

  // ✅ Date Format Fix
  const formatDateTime = (date, time) => {
    if (!date && !time) return { date: "-", time: "-" };

    const dateObj = moment(time || date);

    if (dateObj.isValid()) {
      return {
        date: dateObj.format("DD/MM/YYYY"),
        time: dateObj.format("hh:mm:ss A"),
      };
    }

    return { date: "-", time: "-" };
  };

  // ✅ Pagination Logic
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page) => {
    fetchData(rowData.id, page);
  };

  return (
    <div className="card mt-4">
      <div className="card-body">

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            {/* ✅ TABLE */}
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Login Date</th>
                    <th>Login Time</th>
                    <th>Logout Date</th>
                    <th>Logout Time</th>
                  </tr>
                </thead>

                <tbody>
                  {loginList.length > 0 ? (
                    loginList.map((item, index) => (
                      <tr key={item.id}>
                        <td>{currentPage * pageSize + index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.loginDateOnly}</td>
                        <td>{item.loginTimeOnly}</td>
                        <td>{item.logoutDateOnly}</td>
                        <td>{item.logoutTimeOnly}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ✅ PAGINATION */}
            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-secondary me-2"
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Prev
              </button>

              <span className="mx-2">
                Page {currentPage + 1} of {totalPages}
              </span>

              <button
                className="btn btn-secondary ms-2"
                disabled={currentPage + 1 >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default DownloadTrackerModel;