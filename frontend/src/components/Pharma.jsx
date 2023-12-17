/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

const Pharma = () => {
  const [meds, setMeds] = useState([]);
  const [prompt, setPrompt] = useState(false);
  const [close, setClose] = useState(false);
  const [tablet, setTablet] = useState({
    name: "",
    x: null,
    y: null,
  });
  const [selectItems, setSelectItems] = useState([]);
  const [selectCount, setSelectCount] = useState(0);

  const addPrompt = () => {
    setPrompt(true);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTablet({ ...tablet, [name]: value });
    console.log(tablet);
  };
  const handleClose = () => {
    setPrompt(!prompt);
    setClose(!close);
  };
  const addTablet = async (e) => {
    if (tablet.name === "" || tablet.x === null || tablet.y === null) {
      window.alert("Please fill all the fields");
      return;
    }
    e.preventDefault();
    await axios.post("http://localhost:3000/api/medical", {
      withCredentials: true,
      name: tablet.name,
      x: tablet.x,
      y: tablet.y,
    });

    setMeds((prevMeds) => [...prevMeds, tablet]);
    setTablet({
      name: "",
      x: null,
      y: null,
    });
  };
  const editTablet = async (e) => {
    console.log(e.target);
    window.prompt("Enter the new name", e.target.name);
    await axios
      .put("http://localhost:3000/api/medical", {
        withCredentials: true,
        name: e.target.name,
        x: e.target.x,
        y: e.target.y,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteTablet = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete this tablet?"))
        return;
      else {
        await axios.delete(`http://localhost:3000/api/medical/${id}`, {
          withCredentials: true,
        });
        // After deletion, update the local state
        setMeds((prevMeds) => prevMeds.filter((med) => med._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const url = "http://localhost:3000/api/medical";
        const { data } = await axios.get(url, { withCredentials: true });
        // console.log(meds);
        setMeds(data.result);
      } catch (error) {
        console.error("Error fetching medicines: ", error);
      }
    };

    fetchMedicines();
    console.log({ selectItems });
  }, [selectItems]);

  const selectItem = async (e, x, y) => {
    console.log(e.target);
    let xCord = x;
    let yCord = y;

    if (e.target.innerText === "Select") {
      e.target.innerText = "Selected";
      e.target.style.background = "black";
      e.target.style.color = "white";
      setSelectCount((prevCount) => prevCount + 1);
      setSelectItems((prevItems) => [...prevItems, { x: xCord, y: yCord }]);
    } else if (e.target.innerText === "Selected") {
      e.target.innerText = "Select";
      e.target.style.background = "white";
      e.target.style.color = "black";
      setSelectCount((prevCount) => prevCount - 1);
      // Use the callback version to ensure you're working with the latest state
      setSelectItems((prevItems) => {
        const indexToRemove = prevItems.findIndex(
          (item) => item.x === x && item.y === y
        );
        if (indexToRemove !== -1) {
          const updatedItems = [...prevItems];
          updatedItems.splice(indexToRemove, 1);
          console.log({ selectItems: updatedItems });
          return updatedItems;
        } else {
          return prevItems;
        }
      });
    }

    // Log the state outside the setState callback
    // console.log({ selectItems });
  };

  const sendXY = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/api/sendXY", {
        coordinates: selectItems, // Update the key to match your backend (coordinates vs items)
      });

      console.log("Coordinates sent successfully!");
    } catch (error) {
      console.error("Error sending coordinates:", error);
      // Handle the error as needed (e.g., show an error message to the user)
    }
  };

  return (
    <PharmaContainer>
      <h1>Pharmacy</h1>

      {prompt && (
        <form action="">
          <Head>
            <h1>Add a Tablet</h1>
            <AiOutlineCloseCircle onClick={handleClose} />
          </Head>
          <div className="entries">
            <input
              type="text"
              name="name"
              placeholder="Tablet Name"
              onChange={handleChange}
              value={tablet.name}
            />
            <input
              type="number"
              name="x"
              placeholder="X"
              onChange={handleChange}
              value={tablet.x}
            />
            <input
              type="number"
              name="y"
              placeholder="Y"
              onChange={handleChange}
              value={tablet.y}
            />
          </div>
          <button type="button" onClick={addTablet}>
            Done
          </button>
        </form>
      )}
      <button onClick={addPrompt}> + Add a Tablet</button>
      <Medicines>
        {meds.map((med, index) => (
          <Tablet key={index}>
            <div className="icons">
              <CiEdit onClick={editTablet} />
              <MdDelete onClick={() => deleteTablet(med._id)} />
            </div>
            <div className="info">
              <p>{med.name}</p>
              <span>
                ({med.x},{med.y})
              </span>
            </div>
            <button onClick={(e) => selectItem(e, med.x, med.y)}>Select</button>
          </Tablet>
        ))}
      </Medicines>
      <button onClick={sendXY}>Done</button>
    </PharmaContainer>
  );
};

export default Pharma;

const PharmaContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;

  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    border-radius: 5px;
    border: 2px solid black;
    margin: 10px;

    .entries {
      display: flex;
      flex-direction: row;
      margin: 10px;
      input {
        padding: 10px;
        margin: 5px;
        border-radius: 5px;
        border: 1px solid black;
        background: white;
      }
    }
  }
  button {
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
    border: 1px solid black;
    background: white;
    cursor: pointer;
  }
`;

const Head = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  h1 {
    aling-self: center;
    margin: 10px auto;
  }
  svg {
    cursor: pointer;
    font-size: 1.5rem;
  }
`;
const Medicines = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
`;

const Tablet = styled.div`
  border: 1px solid black;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 200px;

  .icons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 80%;
    // margin: 10px;
    svg {
      cursor: pointer;
      font-size: 1rem;
      margin: 0 5px;
    }
  }

  .info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 80%;
    margin: 10px;
    span {
      font-size: 1rem;
      font-weight: 300;
    }
  }
`;
