import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import "../styling/CustomTable.css";
import Fields from "./Fields";
function CustomTable() {
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState({});
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  useEffect(() => {
    const getCustomers = async () => {
      await fetch("http://localhost:8000/")
        .then((response) => response.json())
        .then((data) => {
          setCustomers(data);
        });
    };

    getCustomers();
  }, [show]);

  const onButtonClick = async (id) => {
    setShow(true);
    await fetch(`http://localhost:8000/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCustomer(data);
      });
  };

  const renderTableModal = () => (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="customTable__modal__header">
          <Modal.Title className="customTable__modal__title">{`${customer.first_name} ${customer.last_name}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="customTable__modal__body__fields">
            <Fields
              property={customer.first_name}
              title="First Name"
              disabled
            />
            <Fields property={customer.last_name} title="Last Name" disabled />
            <Fields property={customer.address} title="Address" disabled />
            <Fields
              property={customer.balance}
              title="Account Balance"
              disabled
            />
            <Fields
              title="Amount"
              amount__input
              customer={customer}
              handleClose={handleClose}
              customers={customers}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

  return (
    <div className="customTable">
      <Table
        striped
        bordered
        hover
        variant="dark"
        responsive="sm"
        className="customTable__table"
      >
        <thead className="customTable__head">
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Address</th>
            <th>Balance</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody className="customTable__body">
          {customers?.map(
            ({ _id, first_name, last_name, address, balance }, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{first_name.toUpperCase()}</td>
                <td>{last_name.toUpperCase()}</td>
                <td>{address.toUpperCase()}</td>
                <td>{balance}</td>
                <td>
                  <Button onClick={() => onButtonClick(_id)} variant="info">
                    View Details
                  </Button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
      {renderTableModal()}
    </div>
  );
}

export default CustomTable;
