import React,{useState,useEffect} from 'react'
import * as Yup from "yup";
import Select from "react-select";
import AxiosUser from '../shared/AxiosUser';
import { Formik, Form } from "formik";
import Axios from '../shared/Axios';
import * as XLSX from "xlsx";

const validateForm = Yup.object().shape({
  companyName: Yup.string().required("Please select company"),
});

const initialValues = {
  companyName: "",
};


function CompanyWiseQuery() {
     const [companyList, setCompanyList] = useState([]);
     const [queryList, setQueryList] = useState([]);
     const [loading, setLoading] = useState(false);
     const [companyDownloadData, setCompanyDownloadData] = useState(null);
  useEffect(() => {
    getCompanies();
  }, []);

    const getCompanies = () => {
    Axios({
      method: "GET",
      url: `/search-management/companynames`,
    })
      .then((res) => {
        console.log("Company list", res.data);
        setCompanyList(res.data || []);
      })
      .catch((err) => {
        console.log("User dropdown error", err);
      });
  };

  const companyOptions = companyList
  .filter((company) => company)
  .map((company, index) => ({
    value: company,
    label: company,
  }));


 const formatDateTime = (date) => {
  if (!date) return "";

  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

    return {
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes} ${ampm}`,
      };

  //return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
};

const downloadSubmit = (values) => {
  setLoading(true);

  let url = `search-management/companyqueries?companyName=${encodeURIComponent(values.companyName)}`;

  Axios({
    method: "GET",
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      const queryList = res?.data?.queryList || [];

      console.log("Company wise query data", queryList);

      if (!queryList.length) {
        alert("No data found for download.");
        return;
      }

      const excelData = queryList.map((item,index) => ({
      
        SERIAL_NO: index + 1,
        Search_Type: item.userSearchQuery?.searchType || "",
        Query: "SEARCH VALUE: " + (Array.isArray(item.userSearchQuery?.searchValue)
                            ? item.userSearchQuery.searchValue.join(", ")
                            : item.userSearchQuery?.searchValue || "") + "; " ,
       

        Trade_Type: item.userSearchQuery?.tradeType || "",
         Country: Array.isArray(item.userSearchQuery?.countryCode)
                ? item.userSearchQuery.countryCode.join(", ")
                : item.userSearchQuery?.countryCode || "",

        From_Date: item.userSearchQuery?.fromDate || "",
        To_Date: item.userSearchQuery?.toDate || "",
        Search_By: item.userSearchQuery?.searchBy || "",
      
        IP: item.ipAddress || "",
       
        Total_Records: item.totalRecords || 0,
        Created_Date: formatDateTime(item.createdDate).date || "",
        Created_Time: formatDateTime(item.createdDate).time || "",
        Created_By: item.createdByName || "",
      
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Company Queries");

      XLSX.writeFile(
        workbook,
        `${values.companyName || "company"}_query_report.xlsx`
      );
    })
    .catch((err) => {
      console.log("Err", err);
      alert("Failed to download excel.");
    })
    .finally(() => {
      setLoading(false);
    });
};

  return (
    <div>

           <div className="page-header mb-4">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-2">
                    <li className="breadcrumb-item">
                      <a href="!#" onClick={(event) => event.preventDefault()}>
                      User
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      <h3 className="page-title mb-0">Company Wise Query Download</h3>
                    </li>
                  </ol>
                </nav>
              </div>
        
              <div className="filter-section bg-light p-3 rounded shadow-sm">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validateForm}
                  onSubmit={downloadSubmit}
                >
                  {({ values, setFieldValue, resetForm, errors, touched }) => (
                    <Form>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          width: "100%",
                          marginTop: "10px"
                        }}
                      >
                        <div
                          className="d-flex flex-wrap align-items-end gap-3 bg-white p-3 rounded shadow-sm"
                          style={{ width: "50%" }}
                        >
                         <div className="flex-grow-1" style={{ minWidth: "160px", paddingRight: "10px" }}>
                            <label className="form-label fw-semibold mb-2">Company Name</label>
                            <Select
                                name="companyName"
                                options={companyOptions}
                                value={companyOptions.find((option) => option.value === values.companyName) || null}
                                onChange={(selectedOption) =>
                                setFieldValue("companyName", selectedOption ? selectedOption.value : "")
                                }
                                placeholder="Select Company..."
                                isSearchable
                                isClearable
                            />
                            {errors.companyName && touched.companyName && (
                                <div className="text-danger mt-1">{errors.companyName}</div>
                            )}
                            </div>
        
                              <div style={{ minWidth: "130px", paddingRight: "10px" }}>
                                <button
                                  type="submit"
                                  className="btn btn-primary w-100"
                                  style={{ height: "42px" }}
                                  disabled={loading}
                                >
                                  {loading ? "DOWNLOADING..." : "DOWNLOAD"}
                                </button>
                              </div>
        
                              <div style={{ minWidth: "130px" }}>
                                <button
                                  type="button"
                                  className="btn btn-secondary w-100"
                                  style={{ height: "42px" }}
                                  onClick={() => {
                                    resetForm();
                                    setQueryList([]);
                                  }}
                                >
                                  RESET
                                </button>
                              </div>
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
    </div>
  )
}

export default CompanyWiseQuery