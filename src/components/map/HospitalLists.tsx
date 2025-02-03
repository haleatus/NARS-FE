import React from "react";
import hospitalData from "@/data/hospital-data.json";

const HospitalList = () => {
  return (
    <div className="p-4 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Hospitals</h2>
      {hospitalData.length === 0 ? (
        <p>No hospitals found.</p>
      ) : (
        <ul className="space-y-2">
          {hospitalData.map((hospital, index) => (
            <li key={index} className="bg-white p-3 rounded-lg shadow-md">
              <h3 className="font-semibold">{hospital.name}</h3>
              <div className="text-gray-600">
                <p>Latitude: {hospital.latitude}</p>
                <p>Longitude: {hospital.longitude}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HospitalList;
