/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
function Try() {
  const [data, setData] = useState({
    Name: "",
    Place: "",
    Animal: "",
    Thing: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/data");
        console.log(response);
        if (response.ok) {
          const jsonData = await response.json();
          setData({
            Name: jsonData.Name,
            Place: jsonData.Place,
            Animal: jsonData.Animal,
            Thing: jsonData.Thing,
          });
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>React and Flask</h1>
      <p>{data.Name}</p>
      <p>{data.Place}</p>
      <p>{data.Animal}</p>
      <p>{data.Thing}</p>
    </div>
  );
}

export default Try;
