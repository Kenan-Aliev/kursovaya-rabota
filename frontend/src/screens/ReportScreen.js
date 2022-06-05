import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import Message from "../components/Message";
import { getReportForPeriod } from "../actions/reportActions";
import { Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Loader from "../components/Loader";

function ReportScreen({ history }) {
  const [startDate, setStartDate] = useState(new Date().toISOString());
  const [endDate, setEndDate] = useState(new Date().toISOString());
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const ordersForPeriod = useSelector((s) => s.report.orders);
  const addedProducts = useSelector((s) => s.report.addedProducts);
  const getReportSuccess = useSelector(
    (s) => s.report.getReportForPeriod.success
  );
  const getReportLoading = useSelector(
    (s) => s.report.getReportForPeriod.loading
  );

  const getReportFailed = useSelector(
    (s) => s.report.getReportForPeriod.failed
  );

  const getReportErrorMessage = useSelector(
    (s) => s.report.getReportForPeriod.message
  );
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }
  }, [dispatch, history, userInfo]);

  const reportSubmit = (e) => {
    e.preventDefault();
    dispatch(
      getReportForPeriod(
        new Date(startDate).toISOString(),
        new Date(endDate).toISOString()
      )
    );
  };

  const totalSumOfOrdersForPeriod = useMemo(() => {
    if (ordersForPeriod.length > 0) {
      return ordersForPeriod.reduce((acc, rec) => {
        return acc + rec.totalPrice;
      }, 0);
    }
  }, [ordersForPeriod]);

  const totalPriceOfAddedProducts = useMemo(() => {
    if (addedProducts.length > 0) {
      return addedProducts.reduce((acc, rec) => {
        return acc + rec.priceOfAddedProducts;
      }, 0);
    }
  }, [addedProducts]);

  return (
    <>
      <Form onSubmit={reportSubmit} className={"w-100"}>
        <Form.Group className="d-flex justify-content-between align-items-end">
          <div className="w-25">
            <Form.Label htmlFor="startDate">Start Date</Form.Label>
            <Form.Control
              type="datetime-local"
              id="startDate"
              name="startdate"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="w-25">
            <Form.Label htmlFor="endDate">End Date</Form.Label>
            <Form.Control
              type="datetime-local"
              name="endDate"
              id="endDate"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" className="w-25">
            Get Report
          </Button>
        </Form.Group>
      </Form>
      <>
        {getReportLoading ? (
          <Loader />
        ) : (
          getReportFailed && (
            <Message variant="danger">{getReportErrorMessage}</Message>
          )
        )}
        {ordersForPeriod.length > 0 && getReportSuccess && (
          <>
            <h1>Orders</h1>
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>USER</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {ordersForPeriod.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.user && order.user.name}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>${order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        <i
                          className="fas fa-check fa-lg"
                          style={{ color: "green" }}
                        ></i>
                      ) : (
                        <i
                          className="fas fa-times fa-lg"
                          style={{ color: "red" }}
                        ></i>
                      )}
                    </td>

                    <td>
                      {order.isDelivered ? (
                        <i
                          className="fas fa-check fa-lg"
                          style={{ color: "green" }}
                        ></i>
                      ) : (
                        <i
                          className="fas fa-times fa-lg"
                          style={{ color: "red" }}
                        ></i>
                      )}
                    </td>

                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button variant="dark" className="btn-sm">
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <h5 className="font-italic">
              Total Sum of Orders for Period: ${totalSumOfOrdersForPeriod}
            </h5>
          </>
        )}
        {ordersForPeriod.length === 0 && getReportSuccess && (
          <h1>No orders for choosen period</h1>
        )}
        {addedProducts.length > 0 && getReportSuccess && (
          <>
            <h1>Added Products</h1>
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>PRODUCT NAME</th>
                  <th>ADDED COUNT FOR PERIOD</th>
                  <th>PRODUCT BUY PRICE</th>
                  <th>SPENT ON PRODUCT FOR PERIOD</th>
                </tr>
              </thead>
              <tbody>
                {addedProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <LinkContainer to={`/product/${product._id}`}>
                        <Button variant="dark" className="btn-sm">
                          {product.products[0].name}
                        </Button>
                      </LinkContainer>
                    </td>
                    <td>{product.addedProductsForPeriod}</td>
                    <td>{product.products[0].buyPrice}$</td>
                    <td>{product.priceOfAddedProducts}$</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <h5 className="font-italic">
              Total Price of Added Products For Period:{" "}
              {totalPriceOfAddedProducts}$
            </h5>
          </>
        )}
        {addedProducts.length === 0 && getReportSuccess && (
          <h1>No added products for choosen period</h1>
        )}
      </>
    </>
  );
}

export default ReportScreen;
