import React, { useState, useEffect } from 'react';
import moment from "moment";
import Axios from '../shared/Axios';

const QueryTrackerModel = ({ rowData }) => {
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [queryList, setQueryList] = useState([]);

  useEffect(() => {
    if (rowData?.id) {
      fetchData(rowData.id, 0);
      getTotalCount(rowData.id);
    }
  }, [rowData]);

  const getTotalCount = (userId) => {
    let url = `/search-management/search/countAllnew`;

    if (userId) {
      url += `?userId=${userId}`;
    }

    Axios({ method: "GET", url })
      .then((res) => {
        const count =
          typeof res.data === "number"
            ? res.data
            : res.data?.totalCount || res.data?.count || 0;

        setTotalCount(count);
      })
      .catch(() => setTotalCount(0));
  };

  const fetchData = (userId, page) => {
    setLoading(true);

    const url = `/search-management/search/listAllnew?pageNumber=${page}&pageSize=${pageSize}&userId=${userId}`;

    Axios({
      method: "GET",
      url,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        const queryData = Array.isArray(res.data)
          ? res.data
          : res.data?.queryList || [];

        const formattedList = queryData.map((item, index) => {
          const created = formatDateTime(item.createdDate);

          return {
            ...item,
            id: item.searchId || `query-${page}-${index}`,
            createdDateOnly: created.date,
            createdTimeOnly: created.time,
          };
        });

        setQueryList(formattedList);
        setCurrentPage(page);

        if (queryData.length === 0 && page === 0) {
          setTotalCount(0);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        setQueryList([]);
        setTotalCount(0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return { date: "-", time: "-" };

    const dateObj = moment(dateString);

    if (dateObj.isValid()) {
      return {
        date: dateObj.format("DD/MM/YYYY"),
        time: dateObj.format("hh:mm:ss A"),
      };
    }

    return { date: "-", time: "-" };
  };

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
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Search Type</th>
                    <th>Query</th>
                    <th>Trade Type</th>
                    <th>Country</th>
                    <th>Period</th>
                    <th>Total Records</th>
                    <th>Created Date</th>
                    <th>Created Time</th>
                    <th>Created By</th>
                  </tr>
                </thead>

                <tbody>
                  {queryList.length > 0 ? (
                    queryList.map((item, index) => (
                      <tr key={item.id}>
                        <td>{currentPage * pageSize + index + 1}</td>
                        <td>{item.userSearchQuery?.searchType || "-"}</td>
                        <td>
                          {Array.isArray(item.userSearchQuery?.searchValue)
                            ? item.userSearchQuery.searchValue.join(", ")
                            : "-"}
                        </td>
                        <td>{item.userSearchQuery?.tradeType || "-"}</td>
                        <td>
                          {Array.isArray(item.userSearchQuery?.countryCode)
                            ? item.userSearchQuery.countryCode.join(", ")
                            : "-"}
                        </td>
                        <td>
                          {item.userSearchQuery?.fromDate || "-"} to{" "}
                          {item.userSearchQuery?.toDate || "-"}
                        </td>
                        <td>{item.totalRecords ?? 0}</td>
                        <td>{item.createdDateOnly}</td>
                        <td>{item.createdTimeOnly}</td>
                        <td>{item.createdByName || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center">
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-secondary me-2"
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Prev
              </button>

              <span className="mx-2">
                Page {totalPages > 0 ? currentPage + 1 : 0} of {totalPages}
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

export default QueryTrackerModel;