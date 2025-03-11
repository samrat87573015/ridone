import React from "react";

export default function Detailstab({ specifications }) {
  // Ensure the specifications are parsed correctly if they are a string
  let parsedSpecifications = [];
  try {
    if (typeof specifications === "string") {
      parsedSpecifications = JSON.parse(specifications);
    } else if (Array.isArray(specifications)) {
      parsedSpecifications = specifications;
    }
  } catch (error) {
    console.error("Failed to parse specifications:", error);
  }

  // Guard to ensure parsedSpecifications is always an array
  const validSpecifications = Array.isArray(parsedSpecifications)
    ? parsedSpecifications
    : [];

  // Convert sequential array into key-value pairs
  const formattedSpecifications = [];
  for (let i = 0; i < validSpecifications.length; i += 2) {
    formattedSpecifications.push({
      key: validSpecifications[i],
      value: validSpecifications[i + 1] || "", // Handle missing value
    });
  }

  // Split into two halves for rendering
  const middleIndex = Math.ceil(formattedSpecifications.length / 2);
  const firstHalf = formattedSpecifications.slice(0, middleIndex);
  const secondHalf = formattedSpecifications.slice(middleIndex);

  const renderTableRows = (data) =>
    data.map((spec, index) => (
      <tr key={index}>
        <th>{spec.key}</th>
        <td>{spec.value}</td>
      </tr>
    ));

  return (
    <div className="my-8">
      <div className="row">
      
        <div className="col-12 col-lg-6">
          <table className="table table-striped">
            <tbody>{renderTableRows(firstHalf)}</tbody>
          </table>
        </div>
        <div className="col-12 col-lg-6">
          <table className="table table-striped">
            <tbody>{renderTableRows(secondHalf)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
