import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//       ---------- CSS import ----------
import "./asset/style/main.css";

//      ---------- Pages import ----------
import Login from "./asset/jsx/pages/Login";
import Signup from "./asset/jsx/pages/Signup";
import Dashboard from "./asset/jsx/pages/Dashboard";
import Tnc from "./asset/jsx/pages/TnC";

// Settlements
import ListSettlement from "./asset/jsx/pages/S01_ListSettlements";
import CreateSettlement from "./asset/jsx/pages/S02_CreateSettlements";
import PreviewSettlement from "./asset/jsx/pages/S03_PreviewSettlements";
import PreviewReport from "./asset/jsx/pages/S04_PreviewSettlementReport";

//Transaction Monitoring
import TransactionMonitoring from "./asset/jsx/pages/T01_TransactionMonitoring";
import TransactionReport from "./asset/jsx/pages/T01_TransactionReport";
import LiveTransactionTable from "./asset/jsx/pages/LiveTransactiontable";
import TempReport from "./asset/jsx/pages/T02_Tempreport";
import TempUReport from "./asset/jsx/pages/T03_TempUReport";
import TempCReport from "./asset/jsx/pages/T04_TempCReport";
import PayoutReport from "./asset/jsx/pages/T05_PayoutReport";
import Compare from "./asset/jsx/pages/T06_Compare";

//Master Settings
import BusinessType from "./asset/jsx/pages/MS01_BusinessType";
import Categories from "./asset/jsx/pages/MS02_Categories";
import BusinessSubcategories from "./asset/jsx/pages/MS03_BusinessSubcategories";
import ManageCurrencies from "./asset/jsx/pages/MS04_ManageCurrencies";
import DocumentType from "./asset/jsx/pages/MS05_DocumentType";
import DocumentCategory from "./asset/jsx/pages/MS06_DocumentCategories";
import Bank from "./asset/jsx/pages/MS07_Bank";

//Manage Merchant
import AllMerchant from "./asset/jsx/pages/M02_AllMerchant";
import ViewMerchant from "./asset/jsx/pages/M03_ViewMerchant";
import Whitelisted from "./asset/jsx/pages/M03_Whitelisted";
import PaymentLink from "./asset/jsx/pages/M04_PaymentLink";
import Adduser from "./asset/jsx/pages/AddUser";
import AllUser from "./asset/jsx/pages/AllUser";
import MerchantSettings from "./asset/jsx/pages/Merchant_Settings";

import Qpay from "./asset/jsx/pages/QPay";
import AQResult from "./asset/jsx/pages/AQResult";

import Setting from "./asset/jsx/pages/setting";

import BankSettlement from "./asset/jsx/pages/Bank_Settlements";
import LiveReport from "./asset/jsx/pages/LiveReport";
import ViewUsers from "./asset/jsx/pages/ViewUsers";
import DummyDash from "./asset/jsx/pages/Dummy_Dashboard";
import Text from "./asset/jsx/pages/text"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Login/ Signup Routes */}
          <Route path="/" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/termsandcondition" element={<Tnc />}></Route>

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/dummydashboard" element={<DummyDash />}></Route>
          <Route path="/livetransactiontable" element={<LiveTransactionTable />}></Route>

          {/* Settlement Routes */}
          <Route path="/settlements" element={<ListSettlement />}></Route>
          <Route path="/createsettlement"element={<CreateSettlement />} ></Route>
          <Route path="/previewsettlement/:company_name"element={<PreviewSettlement />}></Route>
          <Route path="/previewreport/:id" element={<PreviewReport />}></Route>

          {/* Master Settings Routes */}
          <Route path="/businesstype" element={<BusinessType />}></Route>
          <Route path="/categories" element={<Categories />}></Route>
          <Route path="/businesssubcategories" element={<BusinessSubcategories />}></Route>
          <Route path="/managecurrencies" element={<ManageCurrencies />}></Route>
          <Route path="/documenttype" element={<DocumentType />}></Route>
          <Route path="/documentcategory" element={<DocumentCategory />}></Route>
          <Route path="/bank" element={<Bank />}></Route>

          {/* Transaction Report Routes */}
          <Route path="/transactionmonitoring" element={<TransactionMonitoring />}></Route>
          <Route path="/transactionreport" element={<TransactionReport />}></Route>
          <Route path="/tempreport" element={<TempReport />}></Route>
          <Route path="/tempureport" element={<TempUReport />}></Route>
          <Route path="/tempcreport" element={<TempCReport />}></Route>
          <Route path="/payoutreport" element={<PayoutReport />}></Route>
          <Route path="/compare" element={<Compare />}></Route>

          {/* Manage Merchant Routes */}
          <Route path="/allmerchant" element={<AllMerchant />}></Route>
          <Route path="/viewmerchant/:company_name"element={<ViewMerchant />}></Route>
          <Route path="/whitelisted" element={<Whitelisted />}></Route>
          <Route path="/paymentlink" element={<PaymentLink />}></Route>
          <Route path="/merchantsetting" element={<MerchantSettings />}></Route>

          {/* Manage User Routes */}
          <Route path="/alluser" element={<AllUser />}></Route>
          <Route path="/adduser" element={<Adduser />}></Route>

          <Route path="/settings" element={<Setting />}></Route>
		      <Route path="/acquirertestingenv" element={<Qpay />}></Route>
		      <Route path="/paymentresult/:orderNo" element={<AQResult />}></Route>

          <Route path="/banksettle" element={<BankSettlement />}></Route>
          <Route path="/livereport" element={<LiveReport/>}></Route>
          <Route path="/viewuser/:company_name"element={<ViewUsers />}></Route>

          <Route path="/text" element={<Text/>}></Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
