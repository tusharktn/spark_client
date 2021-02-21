import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "../styling/Fields.css";
function Fields({
  property,
  disabled,
  title,
  amount__input,
  customer,
  handleClose,
  customers,
}) {
  const [showButton, setShowButton] = useState(false);
  const [amount, setAmount] = useState("");
  const [receiverId, setReceiverId] = useState("");

  const makeTransaction = () => {
    setShowButton(true);
  };

  const sendMoney = async () => {
    try {
      if (amount !== "" && receiverId !== "") {
        if (Number(customer.balance) >= Number(amount)) {
          const receiverIdInNum = Number(receiverId);
          const receiverObj = customers[receiverIdInNum - 1];

          if (customer._id !== receiverObj._id) {
            let customerBalance = Number(customer.balance) - Number(amount);
            let receiverAmount;
            await fetch(`http://localhost:8000/${receiverObj._id}`)
              .then((response) => response.json())
              .then((data) => {
                receiverAmount = Number(data.balance) + Number(amount);
              })
              .catch((e) => {
                alert("Something went wrong");
              });
            await fetch(
              `http://localhost:8000/${customer._id}/transaction/${receiverObj._id}/${customerBalance}/${receiverAmount}`
            )
              .then((response) => response.json())
              .then((data) => {
                console.log("🚀DATA", data);
              })
              .catch((e) => {
                alert("Something went wrong");
              });
              alert("Amount sent successfully");
          } else {
            alert("Cannot send money to yourself");
          }
          handleClose();

          setAmount("");
          setReceiverId("");
        } else {
          setAmount("");
          alert("Not enough balance");
        }
      } else {
        alert("Please fill the fields");
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="fields">
      {amount__input ? (
        <>
          {showButton ? (
            <>
              <div className="fields__userDetails">
                <span className="fields__user__span">{title}</span>
                <input
                  type="text"
                  className="fields__transaction__input"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                  placeholder="Enter amount"
                />
                <span className="fields__user__span last">Customer ID</span>
                <input
                  type="text"
                  className="fields__transaction__input"
                  value={receiverId}
                  onChange={(e) => {
                    setReceiverId(e.target.value);
                  }}
                  placeholder="Enter customer ID"
                />
              </div>
              <Button
                variant="success"
                className="fields__button fields__button__send"
                onClick={sendMoney}
              >
                Send Money
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="success"
                className="fields__button view"
                onClick={makeTransaction}
              >
                Make a Transaction
              </Button>
            </>
          )}
        </>
      ) : (
        <>
          <span className="fields__span">{title}</span>
          <input
            type="text"
            value={property}
            disabled={disabled}
            className="fields__input"
          />
        </>
      )}
    </div>
  );
}

export default Fields;
