import React, { useState, useEffect } from 'react';
import Axios from '../shared/Axios';
import moment from "moment";

const DownloadTrackerModel = ({ rowData }) => {
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [downloadList, setDownloadList] = useState([]);
 

  const [sortField, setSortField] = useState(null);
const [sortOrder, setSortOrder] = useState("asc");

const handleSort = (field) => {
  if (sortField === field) {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  } else {
    setSortField(field);
    setSortOrder("asc");
  }
};

const sortedData = [...downloadList].sort((a, b) => {
  if (!sortField) return 0;

  const valA = Number(a[sortField] ?? 0);
  const valB = Number(b[sortField] ?? 0);

  return sortOrder === "asc" ? valA - valB : valB - valA;
});

  useEffect(() => {
    if (rowData?.id) {
      fetchData(rowData.id, 0);
      getTotalCount(rowData.id);
    }
  }, [rowData]);

  const getTotalCount = (userId) => {
    let url = `/search-management/search/countAllnew?isDownloaded=Y`;

    if (userId) {
      url += `&userId=${userId}`;
    }

    Axios({
      method: "GET",
      url,
    })
      .then((res) => {
        console.log("Count API success:", res.data);
        const count = typeof res.data === "number" ? res.data : res.data?.totalCount || 0;
        setTotalCount(count);
      })
      .catch((err) => {
        console.log("Count API error:", err);
        setTotalCount(0);
      });
  };

  const fetchData = (userId, page) => {
    setLoading(true);

    const url = `/search-management/search/listAllnew?pageNumber=${page}&pageSize=${pageSize}&userId=${userId}&isDownloaded=Y`;

    Axios({ method: "GET", url })
      .then((res) => {
        console.log("res DATA", res.data);

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.queryList || [];

        const formatted = data.map((item, index) => {
          const downloaded = formatDateTime(item.downloadedDate);

          return {
            id: item.searchId || index,
          //  query: item.userSearchQuery?.searchValue?.join(", ") || "-",
            tradeType: item.userSearchQuery?.tradeType || "-",
           // country: item.userSearchQuery?.countryCode?.join(", ") || "-",

                    query: Array.isArray(item.userSearchQuery?.searchValue)
  ? item.userSearchQuery.searchValue.join(", ")
  : item.userSearchQuery?.searchValue || "-",

country: Array.isArray(item.userSearchQuery?.countryCode)
  ? item.userSearchQuery.countryCode.join(", ")
  : item.userSearchQuery?.countryCode || "-",
            period: formatPeriod(
              item.userSearchQuery?.fromDate,
              item.userSearchQuery?.toDate
            ),
            totalRecords: item.totalRecords ?? 0,
            downloadedDateOnly: downloaded.date,
            downloadedTimeOnly: downloaded.time,
            downloadedBy: item.downloadedByName || item.downloadedByEmail || "-",
            recordsDownloaded: item.recordsDownloaded ?? 0,
          };
        });

        setDownloadList(formatted);
        setCurrentPage(page);
      })
      .catch((err) => {
        console.log("List API error:", err);
        setDownloadList([]);
      })
      .finally(() => setLoading(false));
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return { date: "-", time: "-" };

    const dateObj = moment(dateTime);

    if (dateObj.isValid()) {
      return {
        date: dateObj.format("DD/MM/YYYY"),
        time: dateObj.format("hh:mm:ss A"),
      };
    }

    return { date: "-", time: "-" };
  };

  const formatPeriod = (fromDate, toDate) => {
    if (!fromDate && !toDate) return "-";

    const from = fromDate ? moment(fromDate).format("DD/MM/YYYY") : "-";
    const to = toDate ? moment(toDate).format("DD/MM/YYYY") : "-";

    return `${from} - ${to}`;
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
                    <th>Query</th>
                    <th>Trade Type</th>
                    <th>Country</th>
                    <th>Period</th>
                    <th>Total Records</th>
                    <th>Downloaded On</th>
                    <th>Downloaded Time</th>
                    <th>Downloaded By</th>
                  <th onClick={() => handleSort("recordsDownloaded")} style={{ cursor: "pointer" }}>
  Records Downloaded {sortField === "recordsDownloaded" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
</th>
                  </tr>
                </thead>

     
                         <tbody>
  {sortedData.map((item,index) => (
    <tr key={item.id}>

      <td>{currentPage * pageSize + index + 1}</td>
      <td>{item.tradeType}</td>
      <td>{item.query}</td>
      <td>{item.country}</td>
      <td>{item.period}</td>
      <td>{item.totalRecords}</td>
      <td>{item.downloadedDateOnly}</td>
      <td>{item.downloadedTimeOnly}</td>
      <td>{item.downloadedBy}</td>
      <td>{item.recordsDownloaded}</td>
    </tr>
  ))}
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

export default DownloadTrackerModel;