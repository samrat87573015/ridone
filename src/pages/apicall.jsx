import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ManualRequestForm from "./manualcheckfrom";

const TrueReport = () => {
  const [chassis, setChassis] = useState("");
  const [allReportData, setAllReportData] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;

  const fetchReportData = async () => {
    if (!chassis) return;
    
    setIsLoading(true);
    setError(null);
    setDisplayedData([]);
    setAllReportData([]);
    setCurrentPage(1);

    const code = "2953165_2e9cb5d96474138b0e872e49771c43cc";

    try {
      const response = await axiosInstance.get("cardata", {
        params: { code, chassis },
      });
      
      if (!response || !response.data || !response.data.row) {
        throw new Error("No data found for this chassis.");
      }

      const data = Array.isArray(response.data.row) ? response.data.row : [response.data.row];

      if (data.length === 0) {
        throw new Error("No data found for this chassis.");
      }

      const validatedData = data.map(car => ({
        image: car?.image || null,
        car_model: car?.car_model || "N/A",
        car_year: car?.car_year || "N/A",
        car_cc: car?.car_cc || "1500cc",
        car_grade: car?.car_grade || "N/A",
        car_color: car?.car_color || "N/A",
        status: car?.status || "available",
      }));

      setAllReportData(validatedData);
      paginateData(validatedData, 1);
    } catch (err) {
      setError("No data found for this chassis.");
    } finally {
      setIsLoading(false);
    }
  };

  const paginateData = (data, page) => {
    const startIndex = (page - 1) * dataPerPage;
    const endIndex = startIndex + dataPerPage;
    setDisplayedData(data.slice(startIndex, endIndex));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchReportData();
  };

  return (
    <div>
      <Header />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow">
              <div className="card-header bg-danger text-white">True Report</div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Chassis ID-Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={chassis}
                      onChange={(e) => setChassis(e.target.value)}
                      placeholder="Enter chassis ID"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-danger w-100" disabled={isLoading || !chassis}>
                    {isLoading ? "Fetching..." : "Fetch Report"}
                  </button>
                </form>

                {error && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {error}
                  </div>
                )}

                {displayedData.length > 0 ? (
                  <div className="mt-4">
                    <table className="table">
                      <tbody>
                        {displayedData.map((data, index) => (
                          <tr key={index} className="align-middle">
                            <td className="border" style={{ width: "50%" }}>
                              {data.image ? (
                                <img
                                  src={data.image}
                                  alt="Car"
                                  className="img-fluid w-100"
                                  style={{ height: "150px", objectFit: "contain" }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/placeholder-image.jpg";
                                  }}
                                />
                              ) : (
                                <div className="text-center text-muted" style={{ height: "150px", lineHeight: "150px" }}>
                                  No Image
                                </div>
                              )}
                            </td>
                            <td className="border" style={{ width: "60%" }}>
                              <div className="d-flex flex-column">
                                <div className="mb-1">{data.car_model}</div>
                                <div className="mb-1">{data.car_year}</div>
                                <div className="mb-1">{data.car_cc}</div>
                                <div className="mb-1">{data.car_grade}</div>
                                <div className="mb-1">{data.car_color}</div>
                                <div className="text-muted">{data.status}</div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : error === "No data found for this chassis." ? (
                  <ManualRequestForm />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrueReport;
