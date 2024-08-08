import React, { Component } from "react";

// components
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MessageBox from "../components/Message_box";
import Modal from "../components/Modal";

// images
import companyLogo from "../../media/image/centpays_full_logo.png";

import {
  LeftSign,
  Close,
  Send,
  Attachment,
  Create,
  LeftArrow,
  Folder,
} from "../../media/icon/SVGicons";

class CreateSettlement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebaropen: true,
      token: this.getCookie('token'),
      isNoteOpen: false,
      isEdited: false,
      isPreview: false,
      apiPreview: [],
      apiGenerate: [],
      rows: [
        {
          currency: "USD",
          noApp: 0,
          noDec: 0,
          noRef: 0,
          noChar: 0,
          amtRef: 0,
          amtChar: 0,
        },
      ],
      amounts: [
        {
          RR: "00",
          MDR: "00",
          Approved: "00",
          Decline: "00",
          Refund: "00",
          Chargeback: "00",
          settelment: "00",
          totalfee: "00.00",
          setteltotal: "00.00",
          setteltotalamt: "00",
        },
      ],
      reportNumber: "0000",
      eurToUsd: 1,
      usdToEur: 1,
      usdTToEur: 1,
      textArea:
        "We appreciate your continued business. Your trust is extremely valuable! Thank you for choosing us! Your satisfaction is our priority.",
      isSendPanelOpen: false,
      currencydata: [],
      companyList: [],
      ratedata: [],
      errorMessage: "",
      company_name: this.extractCompanyNameFromURL(),
      dropdownValue: "Default",
      AppCount: " ",
      DecCount: " ",
      fromEmail: '',
      toEmail: '',
      subject: '',
      message: '',
      fileName: 'No File Chosen',
      attachment: null,
    };
  }

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  extractCompanyNameFromURL() {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("company_name");
  }

  extractReportDataFromURL() {
    const searchParams = new URLSearchParams(window.location.search);
    const reportDataString = searchParams.get("reportData");

    let reportData = null;
    if (reportDataString) {
      try {
        reportData = JSON.parse(decodeURIComponent(reportDataString));
      } catch (error) {
        console.error("Error parsing reportData:", error);
      }
    }

    return reportData;
  }

  componentDidMount() {
    this.fetchCompanyList();

    const company_name = this.extractCompanyNameFromURL();
    const reportData = this.extractReportDataFromURL();

    if (company_name !== null) {
      this.fetchCurrencyandRatesData();
    }

    this.setState({ company_name, ...reportData });
  }

  fetchCurrencyandRatesData = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { token } = this.state;
    try {
      const currencyResponse = await fetch(
        `${backendURL}/currenciesforcompany?company_name=${this.state.company_name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const currencyData = await currencyResponse.json();
      if (!currencyData.includes("USD") && currencyData.includes("EUR")) {
        this.setState({
          errorMessage: "Please fill EUR to USDT field.",
          messageType: "notFound",
        });
      }

      const rateResponse = await fetch(
        `${backendURL}/ratetables?company_name=${this.state.company_name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const rateData = await rateResponse.json();
      if (!rateData || Object.keys(rateData).length === 0) {
        this.setState({
          errorMessage: "Rates for this company not found.",
          messageType: "notFound",
        });
      } else {
        this.setState({ ratesdata: rateData });
        if (
          rateData.MDR === undefined &&
          rateData.txn_app === undefined &&
          rateData.txn_dec === undefined &&
          rateData.RR === undefined &&
          rateData.refund_fee === undefined &&
          rateData.chargeback_fee === undefined
        ) {
          this.setState({
            errorMessage: "Rates for this company not found.",
            messageType: "notFound",
          });
        }

        this.setState({ currencydata: currencyData, ratedata: rateData });
      }
    } catch (error) {
      this.setState({
        errorMessage: "Error in Fetching data. Please try again later.",
        messageType: "fail",
      });
    }
  };

  fetchCompanyList = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { token } = this.state;
    try {
      const response = await fetch(`${backendURL}/companylist?status=Active`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      this.setState({ companyList: data });
    } catch (error) {
      this.setState({
        errorMessage: "Error in Fetching data. Please try again later.",
        messageType: "",
      });
    }
  };

  handleNoteToggle = () => {
    this.setState((prevState) => ({
      isNoteOpen: !prevState.isNoteOpen,
    }));
  };

  handleBack = () => {
    const { company_name, isEdited, isPreview } = this.state;
    const currentPath = window.location.pathname + window.location.search;

    const urlParams = new URLSearchParams(window.location.search);
    const queryCompanyName = urlParams.get('company_name');

    if (!isEdited && !isPreview) {
        if (queryCompanyName && currentPath.startsWith("/createsettlement")) {
            window.location.href = `/previewsettlement/${company_name}`;
        } else if (currentPath === "/createsettlement") {
            window.location.href = "/settlements";
        } else {
            window.history.back();
        }
    } else {
        this.setState({
            isPreview: false,
            isEdited: false,
        });
    }
};

  handlePreview = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const {
      fromDate,
      toDate,
      company_name,
      rows,
      eurToUsd,
      usdToEur,
      usdTToEur,
      textArea,
      token,
      dropdownValue,
      amounts,
    } = this.state;

    // Prepare the Preview data
    const previewData = {
      company_name,
      fromDate,
      toDate,
      eur_no_of_refund: "0",
      usd_no_of_refund: "0",
      eur_refund_amount: "0",
      usd_refund_amount: "0",
      eur_no_of_chargeback: "0",
      usd_no_of_chargeback: "0",
      eur_chargeback_amount: "0",
      usd_chargeback_amount: "0",
      eur_to_usd_exc_rate: eurToUsd,
      usd_to_eur_exc_rate: usdToEur,
      eur_to_ustd_exc_rate: usdTToEur,
      note: textArea,
    };

    // Helper function to calculate totals for a currency
    const calculateCurrencyTotals = (
      currency,
      noRef,
      amtRef,
      noChar,
      amtChar
    ) => {
      previewData[`${currency.toLowerCase()}_no_of_refund`] = (
        parseInt(previewData[`${currency.toLowerCase()}_no_of_refund`]) +
        parseInt(noRef)
      ).toString();
      previewData[`${currency.toLowerCase()}_refund_amount`] = (
        parseFloat(previewData[`${currency.toLowerCase()}_refund_amount`]) +
        parseFloat(amtRef)
      ).toString();
      previewData[`${currency.toLowerCase()}_no_of_chargeback`] = (
        parseInt(previewData[`${currency.toLowerCase()}_no_of_chargeback`]) +
        parseInt(noChar)
      ).toString();
      previewData[`${currency.toLowerCase()}_chargeback_amount`] = (
        parseFloat(previewData[`${currency.toLowerCase()}_chargeback_amount`]) +
        parseFloat(amtChar)
      ).toString();
    };

    // Calculate refund and chargeback amounts based on currency
    rows.forEach((row) => {
      if (row.currency === "EUR" || row.currency === "USD") {
        calculateCurrencyTotals(
          row.currency,
          row.noRef,
          row.amtRef,
          row.noChar,
          row.amtChar
        );
      }
    });

    if (dropdownValue === "Full Changes") {
      const apiPreview = amounts ? this.calculateforManual(amounts) : {};
      apiPreview.total_fee = amounts[0].totalfee;
      apiPreview.settelment_vol_usdt = amounts[0].setteltotalamt;
      this.setState({ apiPreview });
    } else if (dropdownValue === "Partial Change") {
      const apiPreview = this.calculateForSemiManually();
      this.setState({ apiPreview });
    } else {
      try {
        const response = await fetch(`${backendURL}/previewsettlement`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(previewData),
        });

        if (!response.ok) {
          throw new Error("Error in Fetching data. Please try again later.");
        }

        const data = await response.json();

        if (data.settlement_record) {
          const AppCount =
            data.settlement_record.usd_app_count ||
            data.settlement_record.eur_app_count;

          const DecCount =
            data.settlement_record.usd_dec_count ||
            data.settlement_record.eur_dec_count;

          this.setState({
            apiPreview: data.settlement_record,
            AppCount: AppCount,
            DecCount: DecCount,
          });
        } else {
          throw new Error("Data is empty or undefined.");
        }
      } catch (error) {
        this.setState({
          errorMessage: error.message,
          messageType: "Fail",
        });
      }
    }

    this.setState({ isPreview: true });
  };

  handleSendSettlement = () => {
    this.setState({ isSendPanelOpen: !this.state.isSendPanelOpen });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isSendPanelOpen !== this.state.isSendPanelOpen) {
      if (this.state.isSendPanelOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
  }

  handleSend = async (e) => {
  
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { fromEmail, toEmail, ccEmail, subject, message, attachment, token } = this.state;
  
    const formData = new FormData();
    formData.append("fromEmail", fromEmail);
    formData.append("toEmail", toEmail);
    formData.append("ccEmail", ccEmail);
    formData.append("subject", subject);
    formData.append("message", message);
    formData.append("attachment", attachment);
  
    try {
      const response = await fetch(`${backendURL}/sendemail`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (response.ok) {
        window.alert("Email sent successfully!");
      } else {
        const errorResponse = await response.json(); // Assuming your backend returns JSON error messages
        console.error("Error response:", errorResponse);
        window.alert("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("An unexpected error occurred. Please try again later.");
    }
  };

  calculateForSemiManually = () => {
    const {
      rows,
      totalAmount,
      ratedata,
      fromDate,
      toDate,
      company_name,
      settlementDate,
    } = this.state;

    if (!ratedata) {
      console.error("Ratedata is undefined");
      return {};
    }

    const {
      MDR,
      txn_app,
      txn_dec,
      refund_fee,
      chargeback_fee,
      RR,
      settlement_fee,
    } = ratedata;

    if (
      MDR === undefined ||
      txn_app === undefined ||
      txn_dec === undefined ||
      refund_fee === undefined ||
      chargeback_fee === undefined ||
      RR === undefined ||
      settlement_fee === undefined
    ) {
      console.error("Ratedata properties are missing");
      return {};
    }

    const eurRows = rows.filter((row) => row.currency === "EUR");
    const usdRows = rows.filter((row) => row.currency === "USD");

    const eur_no_of_refund = eurRows.reduce(
      (acc, row) => acc + parseInt(row.noRef || 0),
      0
    );
    const eur_no_of_chargeback = eurRows.reduce(
      (acc, row) => acc + parseInt(row.noChar || 0),
      0
    );
    const eur_refund_amount = eurRows.reduce(
      (acc, row) => acc + parseFloat(row.amtRef || 0),
      0
    );
    const eur_chargeback_amount = eurRows.reduce(
      (acc, row) => acc + parseFloat(row.amtChar || 0),
      0
    );
    const eur_app_count = eurRows.reduce(
      (acc, row) => acc + parseInt(row.noApp || 0),
      0
    );
    const eur_dec_count = eurRows.reduce(
      (acc, row) => acc + parseInt(row.noDec || 0),
      0
    );

    const usd_no_of_refund = usdRows.reduce(
      (acc, row) => acc + parseInt(row.noRef || 0),
      0
    );
    const usd_no_of_chargeback = usdRows.reduce(
      (acc, row) => acc + parseInt(row.noChar || 0),
      0
    );
    const usd_refund_amount = usdRows.reduce(
      (acc, row) => acc + parseFloat(row.amtRef || 0),
      0
    );
    const usd_chargeback_amount = usdRows.reduce(
      (acc, row) => acc + parseFloat(row.amtChar || 0),
      0
    );
    const usd_app_count = usdRows.reduce(
      (acc, row) => acc + parseInt(row.noApp || 0),
      0
    );
    const usd_dec_count = usdRows.reduce(
      (acc, row) => acc + parseInt(row.noDec || 0),
      0
    );

    const refund_count = eur_no_of_refund + usd_no_of_refund;
    const chargeback_count = eur_no_of_chargeback + usd_no_of_chargeback;

    const refund_amount = eur_refund_amount + usd_refund_amount;
    const chargeback_amount = eur_chargeback_amount + usd_chargeback_amount;

    const app_count = eur_app_count + usd_app_count;
    const dec_count = eur_dec_count + usd_dec_count;

    const MDR_amount = (totalAmount * (MDR / 100)).toFixed(3);
    const app_amount = (app_count * txn_app).toFixed(3);
    const dec_amount = (dec_count * txn_dec).toFixed(3);
    const RR_amount = (totalAmount * (RR / 100)).toFixed(3);

    const amt_after_fees = (
      totalAmount -
      parseFloat(MDR_amount) -
      parseFloat(app_amount) -
      parseFloat(dec_amount) -
      parseFloat(RR_amount)
    ).toFixed(3);

    const settlement_fee_amount = (
      amt_after_fees *
      (settlement_fee / 100)
    ).toFixed(3);

    const settlement_amount = (
      amt_after_fees - parseFloat(settlement_fee_amount)
    ).toFixed(3);

    const total_refund_amount = (
      refund_count * refund_fee +
      refund_amount
    ).toFixed(3);

    const total_chargeback_amount = (
      chargeback_count * chargeback_fee +
      chargeback_amount
    ).toFixed(3);

    const settlement_vol = (
      settlement_amount -
      parseFloat(total_refund_amount) -
      parseFloat(total_chargeback_amount)
    ).toFixed(3);

    return {
      company_name,
      fromDate,
      toDate,
      total_refund_amount: parseFloat(total_refund_amount),
      total_chargeback_amount: parseFloat(total_chargeback_amount),
      settlement_vol: parseFloat(settlement_vol),
      settlementDate,
      usd_app_count,
      usd_dec_count,
      usd_no_of_refund,
      usd_refund_amount,
      usd_no_of_chargeback,
      usd_chargeback_amount,
      eur_app_count,
      eur_dec_count,
      eur_no_of_refund,
      eur_refund_amount,
      eur_no_of_chargeback,
      eur_chargeback_amount,
      total_vol: parseFloat(totalAmount),
      MDR_amount: parseFloat(MDR_amount),
      app_amount: parseFloat(app_amount),
      dec_amount: parseFloat(dec_amount),
      RR_amount: parseFloat(RR_amount),
      settlement_fee_amount: parseFloat(settlement_fee_amount),
    };
  };

  calculateforManual = (amounts) => {
    const {
      rows,
      totalAmount,
      ratedata,
      fromDate,
      toDate,
      company_name,
      settlementDate,
    } = this.state;

    if (!ratedata) {
      console.error("Ratedata is undefined");
      return {};
    }

    const { MDR, txn_app, txn_dec, RR, settlement_fee } = ratedata;

    if (
      MDR === undefined ||
      txn_app === undefined ||
      txn_dec === undefined ||
      RR === undefined ||
      settlement_fee === undefined
    ) {
      console.error("Ratedata properties are missing");
      return {};
    }

    let usd_no_of_refund = 0,
      usd_no_of_chargeback = 0,
      usd_refund_amount = 0,
      usd_chargeback_amount = 0,
      usd_app_count = 0,
      usd_dec_count = 0,
      eur_no_of_refund = 0,
      eur_no_of_chargeback = 0,
      eur_refund_amount = 0,
      eur_chargeback_amount = 0,
      eur_app_count = 0,
      eur_dec_count = 0;

    rows.forEach((row) => {
      if (row.currency === "USD") {
        usd_no_of_refund += parseInt(row.noRef || 0);
        usd_no_of_chargeback += parseInt(row.noChar || 0);
        usd_refund_amount += parseFloat(row.amtRef || 0);
        usd_chargeback_amount += parseFloat(row.amtChar || 0);
        usd_app_count += parseInt(row.noApp || 0);
        usd_dec_count += parseInt(row.noDec || 0);
      } else if (row.currency === "EUR") {
        eur_no_of_refund += parseInt(row.noRef || 0);
        eur_no_of_chargeback += parseInt(row.noChar || 0);
        eur_refund_amount += parseFloat(row.amtRef || 0);
        eur_chargeback_amount += parseFloat(row.amtChar || 0);
        eur_app_count += parseInt(row.noApp || 0);
        eur_dec_count += parseInt(row.noDec || 0);
      }
    });

    return {
      company_name,
      fromDate,
      toDate,
      settlement_vol: parseFloat(amounts[0].setteltotal),
      settelment_vol_usdt: parseFloat(amounts[0].setteltotalamt),
      total_fee: parseFloat(amounts[0].totalfee),
      settlementDate,
      usd_app_count,
      usd_dec_count,
      usd_no_of_refund,
      usd_refund_amount,
      usd_no_of_chargeback,
      usd_chargeback_amount,
      eur_app_count,
      eur_dec_count,
      eur_no_of_refund,
      eur_refund_amount,
      eur_no_of_chargeback,
      eur_chargeback_amount,
      total_vol: parseFloat(totalAmount),
      MDR_amount: parseFloat(amounts[0].MDR),
      app_amount: parseFloat(amounts[0].Approved),
      dec_amount: parseFloat(amounts[0].Decline),
      total_refund_amount: parseFloat(amounts[0].Refund),
      total_chargeback_amount: parseFloat(amounts[0].Chargeback),
      RR_amount: parseFloat(amounts[0].RR),
      settlement_fee_amount: parseFloat(amounts[0].settelment),
    };
  };

  handleSaveBack = () => {
    this.setState({
      isEdited: false,
      isPreview: false,
      company_name: "",
      fromDate: "",
      toDate: "",
      currencyData: null,
      rateData: null,
    });
  };

  handleGenerate = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const {
      fromDate,
      toDate,
      company_name,
      rows,
      eurToUsd,
      usdToEur,
      usdTToEur,
      textArea,
      token,
      dropdownValue,
      ratedata,
      amounts,
    } = this.state;

    if (this.state.isSaveButtonClicked) {
      this.setState({
        errorMessage: "Report saved Successfully",
        messageType: "success",
      });
    }

    if (!ratedata) {
      this.setState({
        errorMessage: "Ratedata is not loaded. Please try again later.",
        messageType: "Fail",
      });
      return;
    }
    // Prepare the settlement data
    const settlementData = {
      company_name,
      fromDate,
      toDate,
      eur_no_of_refund: "0",
      usd_no_of_refund: "0",
      eur_refund_amount: "0",
      usd_refund_amount: "0",
      eur_no_of_chargeback: "0",
      usd_no_of_chargeback: "0",
      eur_chargeback_amount: "0",
      usd_chargeback_amount: "0",
      eur_to_usd_exc_rate: eurToUsd,
      usd_to_eur_exc_rate: usdToEur,
      eur_to_ustd_exc_rate: usdTToEur,
      note: textArea,
    };

    // Helper function to calculate totals for a currency
    const calculateCurrencyTotalsSettlements = (
      currency,
      noRef,
      amtRef,
      noChar,
      amtChar
    ) => {
      settlementData[`${currency.toLowerCase()}_no_of_refund`] = (
        parseInt(settlementData[`${currency.toLowerCase()}_no_of_refund`]) +
        parseInt(noRef)
      ).toString();
      settlementData[`${currency.toLowerCase()}_refund_amount`] = (
        parseFloat(settlementData[`${currency.toLowerCase()}_refund_amount`]) +
        parseFloat(amtRef)
      ).toString();
      settlementData[`${currency.toLowerCase()}_no_of_chargeback`] = (
        parseInt(settlementData[`${currency.toLowerCase()}_no_of_chargeback`]) +
        parseInt(noChar)
      ).toString();
      settlementData[`${currency.toLowerCase()}_chargeback_amount`] = (
        parseFloat(
          settlementData[`${currency.toLowerCase()}_chargeback_amount`]
        ) + parseFloat(amtChar)
      ).toString();
    };

    // Calculate refund and chargeback amounts based on currency
    rows.forEach((row) => {
      if (row.currency === "EUR" || row.currency === "USD") {
        calculateCurrencyTotalsSettlements(
          row.currency,
          row.noApp,
          row.noDec,
          row.noRef,
          row.amtRef,
          row.noChar,
          row.amtChar
        );
      }
    });

    if (dropdownValue === "Full Changes") {
      const apiGenerate = amounts ? this.calculateforManual(amounts) : {};

      this.setState({ apiGenerate }, () => {
        if (!this.state.isPreview) {
          this.generatePDF();
        }
      });
    } else if (dropdownValue === "Partial Change") {
      const apiGenerate = this.calculateForSemiManually();

      this.setState({ apiGenerate }, () => {
        if (!this.state.isPreview) {
          this.generatePDF();
        }
      });
    } else {
      // Make the API call
      fetch(`${backendURL}/settlements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settlementData),
      })
        .then((response) => {
          if (!response.ok) {
            this.setState({
              errorMessage: "Error in Fetching data. Please try again later.",
              messageType: "Fail",
            });
          }
          return response.json();
        })
        .then((data) => {
          if (data.settlement_record) {
            this.setState({ apiGenerate: data.settlement_record }, () => {
              if (!this.state.isPreview) {
                this.generatePDF();
              }
            });
          } else {
            this.setState({
              errorMessage: "Settlement data is empty or undefined.",
              messageType: "Failed",
            });
          }
        })
        .catch((error) => {
          this.setState({
            errorMessage: "There was a problem with your fetch operation:",
            messageType: "Failed",
          });
        });
    }

    // Mark as edited
    this.setState({ isEdited: true });
  };

  generatePDF = () => {
    window.print();
  };

  handleSendInputChange = (event) => {
    const { id, value, files } = event.target;

    if (id === 'attachment' && files.length > 0) {
      this.setState({ fileName: files[0].name, attachment: files[0] });
    } else {
      this.setState({ [id]: value });
    }
  };

  handleInputChange = (event, field) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  handleSelectChange = (event) => {
    this.setState(
      {
        [event.target.id]: event.target.value,
      },
      () => {
        this.fetchCurrencyandRatesData(this.state.company_name);
      }
    );
  };

  handleRowInputChange = (event, rowIndex, field) => {
    const { value } = event.target;
    const { rows } = this.state;
    const updatedRows = [...rows];
    updatedRows[rowIndex][field] = value;

    this.setState({ rows: updatedRows });
  };

  addRow = () => {
    this.setState((prevState) => ({
      rows: [
        ...prevState.rows,
        {
          noApp: "0",
          noDec: "0",
          noRef: "0",
          noChar: "0",
          amtRef: "0",
          amtChar: "0",
        },
      ],
    }));
  };

  removeRow = (index) => {
    this.setState((prevState) => {
      const updatedRows = prevState.rows.filter(
        (row, rowIndex) => rowIndex !== index
      );
      return { rows: updatedRows };
    });
  };

  handleDropdownChange = (event) => {
    this.setState({ dropdownValue: event.target.value });
  };

  handleAmountChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      amounts: [{ ...this.state.amounts[0], [name]: value }],
    });
  };

  handleChange = (event, field) => {
    const { value } = event.target;
    const calculatedValue =
      parseFloat(value) * parseFloat(this.state.usdTToEur);
    this.setState((prevState) => ({
      amounts: [
        {
          ...prevState.amounts[0],
          [field]: value,
          calculatedValue,
        },
      ],
    }));
  };

  handleTotalFeeChange = (event) => {
    const { value } = event.target;
    this.setState({
      amounts: [{ ...this.state.amounts[0], totalfee: value }],
    });
  };

  handlePreviewEdit = () => {
    this.setState({ usdNoOfRef: this.state.apiPreview.usd_no_of_refund });

    this.setState({ eurNoOfRef: this.state.apiPreview.eur_no_of_refund });
    this.setState({ EurAmtOfRef: this.state.apiPreview.eur_refund_amount });
    this.setState({
      usdNoOfChargeback: this.state.apiPreview.usd_no_of_chargeback,
    });
    this.setState({
      usdAmtOfChargeback: this.state.apiPreview.usd_chargeback_amount,
    });
    this.setState({
      eurNoOfChargeback: this.state.apiPreview.eur_no_of_chargeback,
    });
    this.setState({
      eurAmtOfChargeback: this.state.apiPreview.eur_chargeback_amount,
    });
    this.setState({ isPreview: false });
    if (this.state.dropdownValue === "Default") {
      this.setState({ isEditing: true });
    }
  };

  render() {
    const {
      isNoteOpen,
      apiPreview,
      apiGenerate,
      ratedata,
      amounts,
      errorMessage,
      dropdownValue,
      messageType,
      isEditing,
      AppCount,
      DecCount,
      modalMessage,
      isModalOpen,
    } = this.state;

    const { rows } = this.state;

    const { isEdited, isPreview } = this.state;

    // ------------------------------- Preview ----------------------------------------
    if (isPreview) {
      // Render a different UI when the user has initiated a preview action
      return (
        <>
          <Header />
          <Sidebar />
          {errorMessage && (
            <MessageBox
              message={errorMessage}
              messageType={messageType}
              onClose={() =>
                this.setState({ errorMessage: "", messageType: "" })
              }
            />
          )}
          <div
            className={`main-screen ${
              this.state.sidebaropen
                ? "collapsed-main-screen"
                : "expanded-main-screen"
            }  `}
          >
            <div className="create-settlement-container">
              <div className="row-cards create-settlement-left-container">
              <div className="bcksettlement">
                  <LeftArrow
                    className="icon2"
                    onClick={this.handleBack}
                  ></LeftArrow>
                </div>
                <div className="create-settlement-left-container-header">
                  <div className="settlement-header-left">
                    <img
                      className="logo"
                      src={companyLogo}
                      alt="Centpays"
                    ></img>
                    <div>
                      <p className="p2">info@centpays.com</p>
                      <p className="p2">sales@centpays.com</p>
                      <p className="p2">live:.cid.b31237494431be4a</p>
                    </div>
                  </div>
                  <div className="settlement-header-right preview-HR">
                    <label htmlFor="report #">Report #</label>
                    <p className="highlight-text ">#</p>

                    <label htmlFor="fromDate">Settlement From</label>
                    <p className="highlight-text ">
                      {apiPreview.fromDate
                        ? apiPreview.fromDate.replace("T", " ")
                        : ""}
                    </p>

                    <label htmlFor="toDate">Settlement To</label>
                    <p className="highlight-text ">
                      {apiPreview.toDate
                        ? apiPreview.toDate.replace("T", " ")
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="create-settlement-left-second-container">
                  <div className="settlement-second-container-grid">
                    <label htmlFor="merchant">To: </label>
                    <p>{apiPreview.company_name}</p>
                  </div>
                  <div className="second-container-right">
                    <p>Currency:</p>
                    <p>USDT</p>
                  </div>
                </div>

                <div className="create-settelment-list-block">
                  <div className="create-settelment-list-block">
                    <p>
                      Dealing currencies:{" "}
                      <i className="p2">{this.state.currencydata.join(", ")}</i>
                    </p>
                  </div>

                  <div className="prewive-list-table ">
                    <table>
                      <thead>
                        <tr>
                          <th>Currency</th>
                          <th>#Approved</th>
                          <th>#Decline</th>
                          <th>#Refund</th>
                          <th>Refund Amount</th>
                          <th>#Chargeback</th>
                          <th>Chargeback Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>USD</td>
                          <td>{apiPreview.usd_app_count}</td>
                          <td>{apiPreview.usd_dec_count}</td>
                          <td>{apiPreview.usd_no_of_refund}</td>
                          <td>{apiPreview.usd_refund_amount}</td>
                          <td>{apiPreview.usd_no_of_chargeback}</td>
                          <td>{apiPreview.usd_chargeback_amount}</td>
                        </tr>
                        <tr>
                          <td>EUR</td>
                          <td>{apiPreview.eur_app_count}</td>
                          <td>{apiPreview.eur_dec_count}</td>
                          <td>{apiPreview.eur_no_of_refund}</td>
                          <td>{apiPreview.eur_refund_amount}</td>
                          <td>{apiPreview.eur_no_of_chargeback}</td>
                          <td>{apiPreview.eur_chargeback_amount}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="create-settelment-rates-block preview-TA-Countainer">
                  <div className="total-amount-countainer ">
                    <p>
                      Total Amount - {apiPreview.total_vol}
                      {` `}
                      {ratedata.currency}
                    </p>
                  </div>
                  <div className="create-settelments-horizontal-line"></div>
                  <div className="create-settelment-rates-list">
                    <div className="create-settelment-rates-list-title">
                      <ul>
                        <li>MDR Base Rates</li>
                        <li>Approved Transaction Fee</li>
                        <li>Decline Transaction Fee</li>
                        <li>Refund Fee</li>
                        <li>Chargeback Fee</li>
                        <li>Rolling Reserve</li>
                        <li>Settlement Fee</li>
                      </ul>
                    </div>
                    <div className="create-settelment-rates-list-rates">
                      <div className="create-settelment-rates-list-FeeRates">
                        <p>Fee Rates {` (${ratedata.currency})`}</p>
                        <ul>
                          <li>{ratedata.MDR}</li>
                          <li>{ratedata.txn_app}</li>
                          <li>{ratedata.txn_dec}</li>
                          <li>{ratedata.refund_fee}</li>
                          <li>{ratedata.chargeback_fee}</li>
                          <li>{ratedata.RR}</li>
                          <li>{ratedata.settlement_fee}</li>
                        </ul>
                      </div>
                      <div className="rates-divider">
                        <ul>
                          <li>-</li>
                          <li>-</li>
                          <li>-</li>
                          <li>-</li>
                          <li>-</li>
                          <li>-</li>
                          <li>-</li>
                        </ul>
                      </div>
                      <div className="create-settelment-rates-list-amounts">
                        <p>Amounts</p>
                        <ul>
                          <li>{apiPreview.MDR_amount}</li>
                          <li>{apiPreview.app_amount}</li>
                          <li>{apiPreview.dec_amount}</li>
                          <li>{apiPreview.total_refund_amount}</li>
                          <li>{apiPreview.total_chargeback_amount}</li>
                          <li>{apiPreview.RR_amount}</li>
                          <li>{apiPreview.settlement_fee_amount}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="create-settelment-Fee-Total">
                  <p>Fee Total</p>
                  {dropdownValue === "Full Changes" ? (
                    <p>{parseFloat(apiPreview.total_fee).toFixed(3)}</p>
                  ) : (
                    <p>
                      {(
                        apiPreview.MDR_amount +
                        apiPreview.app_amount +
                        apiPreview.dec_amount +
                        apiPreview.total_refund_amount +
                        apiPreview.total_chargeback_amount +
                        apiPreview.RR_amount +
                        apiPreview.settlement_fee_amount
                      ).toFixed(3)}
                    </p>
                  )}
                </div>

                <div className="create-settelment-Total">
                  <p>Settlement Total</p>
                  <p>{apiPreview.settlement_vol}</p>
                </div>

                <div className="create-settelment-Total">
                  <p>Settlement Total in USDT</p>
                  {dropdownValue === "Full Changes" ? (
                    <p>
                      {parseFloat(
                        apiPreview.settelment_vol_usdt *
                          parseFloat(this.state.usdTToEur)
                      ).toFixed(3)}
                    </p>
                  ) : (
                    <p>
                      {(
                        apiPreview.settlement_vol *
                        parseFloat(this.state.usdTToEur)
                      ).toFixed(2)}{" "}
                      USDT
                    </p>
                  )}
                </div>

                <div className="create-settelments-horizontal-line"></div>
                <div className="create-settelment-userNote  usernote-div">
                  <p>Note:</p>
                  <div className="preview-userNote">
                    <p>{this.state.textArea}</p>
                  </div>
                </div>
              </div>

              <div className=" create-settlement-right-container">
                <div className="row-cards create-settlement-right-header">
                  <button className="btn-primary btn1 disabled-button">
                    <Create className="btn-icon black-icon" />
                    <p>Generate</p>
                  </button>
                  <div className="right-header-second-row">
                    <button className="btn-secondary btn2 disabled-button">
                      Preview
                    </button>
                    <button
                      className="btn-secondary btn2"
                      onClick={this.handleGenerate}
                    >
                      Save
                    </button>
                    {isModalOpen && (
                      <Modal
                        modalHeading="Settlement Saved"
                        modalBody={modalMessage}
                        showFotter={true}
                        showDeclinebtn={false}
                        acceptbtnname="View"
                        onAccept={() => {
                          this.setState({ isModalOpen: false });
                          const { recordId } = this.state;
                          window.location.href = `/previewreport/${recordId}`;
                        }}
                        onDecline={() => this.setState({ isModalOpen: false })}
                        onClose={() => this.setState({ isModalOpen: false })}
                      />
                    )}
                  </div>
                  <button
                    className="btn-primary btn3"
                    onClick={this.handleSaveBack}
                  >
                    <LeftSign className="white-icon" />
                    <p>Back</p>
                  </button>
                </div>

                <div className="create-settlement-right-mid">
                  <p className="p2">Conversion Rates:</p>
                  <div className="rates-div">
                    <p>EUR to USD: </p>
                    <input
                      type="text"
                      id="eurToUsd"
                      value={this.state.eurToUsd}
                      className="inputFeild rates-input"
                      readOnly
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="rates-div">
                    <p>USD to EUR: </p>
                    <input
                      type="text"
                      id="usdToEur"
                      value={this.state.usdToEur}
                      className="inputFeild rates-input"
                      readOnly
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="rates-div">
                    <p>EUR to USDT: </p>
                    <input
                      type="text"
                      id="usdTToEur"
                      value={this.state.usdTToEur}
                      className="inputFeild rates-input"
                      readOnly
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>

                <div className="create-settlement-right-bottom">
                  <p className="p2">Client Notes</p>
                  <div className="switch-container">
                    <input
                      className="react-switch-checkbox"
                      id={`react-switch-new`}
                      type="checkbox"
                      checked={false}
                    />
                    <label
                      className={`react-switch-label ${
                        isNoteOpen && "react-switch-label-select"
                      }`}
                      htmlFor={`react-switch-new`}
                    >
                      <span className={`react-switch-button`} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );

      // ------------------------------- Edited ----------------------------------------
    } else if (isEdited) {
      return (
        <>
          <Header />
          <Sidebar />
          {errorMessage && (
            <MessageBox
              message={errorMessage}
              messageType={messageType}
              onClose={() =>
                this.setState({ errorMessage: "", messageType: "" })
              }
            />
          )}
          <div
            className={`main-screen ${
              this.state.sidebaropen
                ? "collapsed-main-screen"
                : "expanded-main-screen"
            }  `}
          >
            <div className="create-settlement-container">
              <div className="row-cards create-settlement-left-container">
              <div className="bcksettlement">
                  <LeftArrow
                    className="icon2"
                    onClick={this.handleBack}
                  ></LeftArrow>
                </div>
                <div className="create-settlement-left-container-header">
                  <div className="settlement-header-left">
                    <img
                      className="logo"
                      src={companyLogo}
                      alt="Centpays"
                    ></img>
                    <div>
                      <p className="p2">info@centpays.com</p>
                      <p className="p2">sales@centpays.com</p>
                      <p className="p2">live:.cid.b31237494431be4a</p>
                    </div>
                  </div>
                  <div className="settlement-header-right preview-HR">
                    <label htmlFor="report #">Report #</label>
                    <p className="highlight-text ">{apiGenerate.report_id}</p>

                    <label htmlFor="fromDate">Settlement From</label>
                    <p className="highlight-text ">{apiGenerate.fromDate}</p>

                    <label htmlFor="toDate">Settlement To</label>
                    <p className="highlight-text ">{apiGenerate.toDate}</p>
                  </div>
                </div>
                <div className="create-settlement-left-second-container">
                  <div className="settlement-second-container-grid">
                    <label htmlFor="merchant">To: </label>
                    <p>{apiGenerate.company_name}</p>
                  </div>
                  <div className="second-container-right">
                    <p>Currency:</p>
                    <p>USDT</p>
                  </div>
                </div>

                <div className="create-settelment-list-block">
                  <div className="create-settelment-list-block">
                    <p>
                      Dealing currencies:{" "}
                      <i className="p2">{this.state.currencydata.join(", ")}</i>
                    </p>
                  </div>

                  <div className="prewive-list-table ">
                    <table>
                      <thead>
                        <tr>
                          <th>Currency</th>
                          <th>#Approved</th>
                          <th>#Decline</th>
                          <th>#Refund</th>
                          <th>Refund Amount</th>
                          <th>#Chargeback</th>
                          <th>Chargeback Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>USD</td>
                          <td>{apiGenerate.usd_app_count}</td>
                          <td>{apiGenerate.usd_dec_count}</td>
                          <td>{apiGenerate.usd_no_of_refund}</td>
                          <td>{apiGenerate.usd_refund_amount}</td>
                          <td>{apiGenerate.usd_no_of_chargeback}</td>
                          <td>{apiGenerate.usd_chargeback_amount}</td>
                        </tr>
                        <tr>
                          <td>EUR</td>
                          <td>{apiGenerate.eur_app_count}</td>
                          <td>{apiGenerate.eur_dec_count}</td>
                          <td>{apiGenerate.eur_no_of_refund}</td>
                          <td>{apiGenerate.eur_refund_amount}</td>
                          <td>{apiGenerate.eur_no_of_chargeback}</td>
                          <td>{apiGenerate.eur_chargeback_amount}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="create-settelment-rates-block preview-TA-Countainer">
                  <div className="total-amount-countainer ">
                    <p>
                      Total Amount - {apiGenerate.total_vol}
                      {` `}
                      {ratedata.currency}
                    </p>
                  </div>
                  <div className="create-settelments-horizontal-line"></div>
                  <div className="create-settelment-rates-list">
                    <div className="create-settelment-rates-list-title">
                      <ul>
                        <li>MDR Base Rates</li>
                        <li>Approved Transaction Fee</li>
                        <li>Decline Transaction Fee</li>
                        <li>Refund Fee</li>
                        <li>Chargeback Fee</li>
                        <li>Rolling Reserve</li>
                        <li>Settlement Fee</li>
                      </ul>
                    </div>
                    <div className="create-settelment-rates-list-rates">
                      <div className="create-settelment-rates-list-FeeRates">
                        <p>Fee Rates {` (${ratedata.currency})`}</p>
                        <ul>
                          <li>{ratedata.MDR}</li>
                          <li>{ratedata.txn_app}</li>
                          <li>{ratedata.txn_dec}</li>
                          <li>{ratedata.refund_fee}</li>
                          <li>{ratedata.chargeback_fee}</li>
                          <li>{ratedata.RR}</li>
                          <li>{ratedata.settlement_fee}</li>
                        </ul>
                      </div>
                      <div className="rates-divider">
                        <ul>
                          <li>-</li>
                          <li>-</li>
                          <li>-</li>
                          <li>-</li>
                          <li>-</li>
                          <li>-</li>
                          <li>-</li>
                        </ul>
                      </div>
                      <div className="create-settelment-rates-list-amounts">
                        <p>Amounts</p>
                        <ul>
                          <li>{apiGenerate.MDR_amount}</li>
                          <li>{apiGenerate.app_amount}</li>
                          <li>{apiGenerate.dec_amount}</li>
                          <li>{apiGenerate.total_refund_amount}</li>
                          <li>{apiGenerate.total_chargeback_amount}</li>
                          <li>{apiGenerate.RR_amount}</li>
                          <li>{apiGenerate.settlement_fee_amount}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="create-settelment-Fee-Total">
                  <p>Fee Total</p>
                  {dropdownValue === "Full Changes" ? (
                    <p>{parseFloat(apiGenerate.totalfee).toFixed(3)}</p>
                  ) : (
                    <p>
                      {(
                        apiGenerate.MDR_amount +
                        apiGenerate.app_amount +
                        apiGenerate.dec_amount +
                        apiGenerate.total_refund_amount +
                        apiGenerate.total_chargeback_amount +
                        apiGenerate.RR_amount +
                        apiGenerate.settlement_fee_amount
                      ).toFixed(3)}
                    </p>
                  )}
                </div>

                <div className="create-settelment-Total">
                  <p>Settlement Total</p>
                  <p>{apiGenerate.settlement_vol}</p>
                </div>

                <div className="create-settelment-Total">
                  <p>Settlement Total in USDT</p>
                  {dropdownValue === "Full Changes" ? (
                    <p>
                      {parseFloat(
                        apiGenerate.settelment_vol_usdt *
                          parseFloat(this.state.usdTToEur)
                      ).toFixed(3)}
                    </p>
                  ) : (
                    <p>
                      {(
                        apiGenerate.settlement_vol *
                        parseFloat(this.state.usdTToEur)
                      ).toFixed(2)}{" "}
                      USDT
                    </p>
                  )}
                </div>

                <div className="create-settelments-horizontal-line"></div>
                <div className="create-settelment-userNote usernote-div">
                  <p>Note:</p>
                  <div className="preview-userNote">
                    <p>{this.state.textArea}</p>
                  </div>
                </div>
              </div>

              <div className=" create-settlement-right-container">
                <div className="row-cards create-settlement-right-header">
                  <button className="btn-primary btn1">
                    <Create className="btn-icon white-icon" />
                    <p>Generate</p>
                  </button>
                  <div className="right-header-second-row">
                    <button className="btn-secondary btn2 disabled-button">
                      Preview
                    </button>
                    <button className="btn-secondary btn2 disabled-button">
                      Save
                    </button>
                  </div>
                  <button
                    className="btn-primary btn3"
                    onClick={() => this.handleSendSettlement()}
                  >
                    <Send className="btn-icon white-icon" />
                    <p>Send</p>
                  </button>
                </div>
                {this.state.isSendPanelOpen && (
                  <>
                    {" "}
                    <div className="overlay"></div>
                    <div className="sendPanel">
                      <div className="sendPanel-header">
                        <h5>Send Invoice</h5>
                        <Close
                          className="icon"
                          onClick={() => this.handleSendSettlement()}
                        />
                      </div>
                      <div className="sendPanel-body">
                        <div className="input-group">
                          <input
                            type="email"
                            id="fromEmail"
                            className="inputFeild auth-input"
                            required
                            onChange={this.handleSendInputChange}
                          />
                          <label htmlFor="fromEmail" className="inputLabel">
                            From
                          </label>
                        </div>
                        <div className="input-group">
                          <input
                            type="email"
                            id="toEmail"
                            className="inputFeild auth-input"
                            required
                            onChange={this.handleSendInputChange}
                          />
                          <label htmlFor="toEmail" className="inputLabel">
                            To
                          </label>
                        </div>
                        <div className="input-group">
                          <input
                            type="email"
                            id="ccEmail"
                            className="inputFeild auth-input"
                            required
                            onChange={this.handleSendInputChange}
                          />
                          <label htmlFor="toEmail" className="inputLabel">
                            CC
                          </label>
                        </div>
                        <div className="input-group">
                          <input
                            type="text"
                            id="subject"
                            className="inputFeild auth-input"
                            required
                            onChange={this.handleSendInputChange}
                          />
                          <label htmlFor="subject" className="inputLabel">
                            Subject
                          </label>
                        </div>
                        <div className="input-group">
                          <textarea
                            className="textarea inputFeild auth-input"
                            id="message"
                            onChange={this.handleSendInputChange}
                          />
                          <label htmlFor="message" className="inputLabel">
                            Message
                          </label>
                        </div>
                        <div className="file-attach">
                          <div className="attachment-div">
                            <Attachment className="primary-color-icon" />
                            <label>Attach Report</label>
                          </div>
                          <div>
                            <input
                              type="file"
                              id="attachment"
                              className="file-input"
                              onChange={this.handleSendInputChange}
                            />
                            <label
                              htmlFor="attachment"
                              className="file-input-label btn-secondary"
                            >
                              <Folder className="icon2 yellow-icon" />
                            </label>
                            <span className="p2 file-name">
                              {this.state.fileName}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="sendInvoice">
                        <button
                          className="btn-primary"
                          onClick={this.handleSend}
                        >
                          Send
                        </button>
                      </div>
                      {/* <button
                        className="btn-secondary"
                        onClick={() => this.handleSendSettlement()}
                      >
                        Cancel
                      </button> */}
                    </div>
                  </>
                )}
                <div className="create-settlement-right-mid">
                  <p className="p2">Conversion Rates:</p>
                  <div className="rates-div">
                    <p>EUR to USD: </p>
                    <input
                      type="text"
                      id="eurToUsd"
                      className="inputFeild rates-input"
                      readOnly
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="rates-div">
                    <p>USD to EUR: </p>
                    <input
                      type="text"
                      id="usdToEur"
                      className="inputFeild rates-input"
                      readOnly
                      onChange={this.handleInputChange}
                    />
                  </div>

                  <div className="rates-div">
                    <p>EUR to USDT: </p>
                    <input
                      type="text"
                      id="usdTToEur"
                      className="inputFeild rates-input"
                      readOnly
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>

                <div className="create-settlement-right-bottom">
                  <p className="p2">Client Notes</p>
                  <div className="switch-container">
                    <input
                      className="react-switch-checkbox"
                      id={`react-switch-new`}
                      type="checkbox"
                      disabled
                    />
                    <label
                      className={`react-switch-label ${
                        isNoteOpen && "react-switch-label-select"
                      }`}
                      htmlFor={`react-switch-new`}
                    >
                      <span className={`react-switch-button`} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );

      // ------------------------------- Default ----------------------------------------
    } else {
      return (
        <>
          <Header />
          <Sidebar />
          {errorMessage && (
            <MessageBox
              message={errorMessage}
              messageType={messageType}
              onClose={() =>
                this.setState({ errorMessage: "", messageType: "" })
              }
            />
          )}
          <div
            className={`main-screen ${
              this.state.sidebaropen
                ? "collapsed-main-screen"
                : "expanded-main-screen"
            }  `}
          >
            <div className="create-settlement-container">
              <div className="row-cards create-settlement-left-container">
                <div className="bcksettlement">
                  <LeftArrow
                    className="icon2"
                    onClick={this.handleBack}
                  ></LeftArrow>
                </div>

                <div className="create-settlement-left-container-header">
                  <div className="settlement-header-left">
                    <img
                      className="logo"
                      src={companyLogo}
                      alt="Centpays"
                    ></img>
                    <div>
                      <p className="p2">info@centpays.com</p>
                      <p className="p2">sales@centpays.com</p>
                      <p className="p2">live:.cid.b31237494431be4a</p>
                    </div>
                  </div>
                  <div className="settlement-header-right">
                    <label htmlFor="report #">Report #</label>
                    <input
                      type="email"
                      id="report"
                      className="inputFeild settlement-input"
                      required
                      readOnly
                      onChange={this.handleInputChange}
                      value={this.state.reportNumber}
                    />

                    <label htmlFor="fromDate">Settlement From</label>
                    <input
                      type="datetime-local"
                      id="fromDate"
                      className="inputFeild settlement-input"
                      required
                      onChange={this.handleInputChange}
                      value={this.state.fromDate}
                    />

                    <label htmlFor="toDate">Settlement To</label>
                    <input
                      type="datetime-local"
                      id="toDate"
                      className="inputFeild settlement-input"
                      required
                      onChange={this.handleInputChange}
                      value={this.state.toDate}
                    />
                  </div>
                </div>
                <div className="create-settlement-left-second-container">
                  <div className="settlement-second-container-grid">
                    <label htmlFor="merchant">To: </label>

                    <select
                      type="select"
                      id="company_name"
                      className="inputFeild select-input"
                      required
                      onChange={this.handleSelectChange}
                      value={this.state.company_name}
                    >
                      <option value="">Select Merchant</option>
                      {this.state.companyList.map((company) => (
                        <option key={company} value={company}>
                          {company}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="second-container-right">
                    <p>Currency:</p>
                    <p>USDT</p>
                  </div>
                </div>

                <div className="create-settelment-list-block">
                  <div className="create-settelment-list-block">
                    <p>
                      Dealing currencies:{" "}
                      <i className="p2">{this.state.currencydata.join(", ")}</i>
                    </p>
                  </div>

                  <div className="list-block">
                    <div className="addrow-heightlimit">
                      {rows.map((rowIndex, index) => (
                        <div className="list-block-column" key={index}>
                          <div className="list-block-column-selector">
                            <select
                              id={`currencySelector${index}`}
                              onChange={(event) =>
                                this.handleRowInputChange(
                                  event,
                                  index,
                                  "currency"
                                )
                              }
                              value={rows[index].currency}
                            >
                              <option>Currency</option>
                              {this.state.currencydata.map((currency) => (
                                <option key={currency} value={currency}>
                                  {currency}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="vertical-line"></div>
                          <div className="list-block-column-input">
                            <div>
                              <span>
                                <label>No. of Approved</label>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={AppCount}
                                    readOnly
                                    onChange={(event) =>
                                      this.handleInputChange(event, "AppCount")
                                    }
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={
                                      this.state.dropdownValue ===
                                        "Partial Change" ||
                                      this.state.dropdownValue ===
                                        "Full Changes"
                                        ? this.state.rows[index].noApp
                                        : "0"
                                    }
                                    readOnly={
                                      this.state.dropdownValue !==
                                        "Partial Change" &&
                                      this.state.dropdownValue !==
                                        "Full Changes"
                                    }
                                    onChange={(event) =>
                                      this.handleRowInputChange(
                                        event,
                                        index,
                                        "noApp"
                                      )
                                    }
                                  />
                                )}
                              </span>
                              <span>
                                <label>No. of Decline</label>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={DecCount}
                                    readOnly
                                    onChange={(event) =>
                                      this.handleInputChange(event, "DecCount")
                                    }
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    defaultValue="0"
                                    value={
                                      this.state.dropdownValue ===
                                        "Partial Change" ||
                                      this.state.dropdownValue ===
                                        "Full Changes"
                                        ? this.state.rows[index].noDec
                                        : "0"
                                    }
                                    readOnly={
                                      this.state.dropdownValue !==
                                        "Partial Change" &&
                                      this.state.dropdownValue !==
                                        "Full Changes"
                                    }
                                    onChange={(event) =>
                                      this.handleRowInputChange(
                                        event,
                                        index,
                                        "noDec"
                                      )
                                    }
                                  />
                                )}
                              </span>
                            </div>
                            <div>
                              <span>
                                <label>No. of Refunds</label>
                                <input
                                  type="text"
                                  value={this.state.rows[index].noRef}
                                  onChange={(event) =>
                                    this.handleRowInputChange(
                                      event,
                                      index,
                                      "noRef"
                                    )
                                  }
                                />
                              </span>
                              <span>
                                <label>No. of Chargebacks</label>
                                <input
                                  type="text"
                                  value={this.state.rows[index].noChar}
                                  onChange={(event) =>
                                    this.handleRowInputChange(
                                      event,
                                      index,
                                      "noChar"
                                    )
                                  }
                                />
                              </span>
                            </div>
                            <div>
                              <span>
                                <label>Amt of Refunds</label>
                                <input
                                  type="text"
                                  value={this.state.rows[index].amtRef}
                                  onChange={(event) =>
                                    this.handleRowInputChange(
                                      event,
                                      index,
                                      "amtRef"
                                    )
                                  }
                                />
                              </span>
                              <span>
                                <label>Amt of Chargebacks</label>
                                <input
                                  type="text"
                                  value={this.state.rows[index].amtChar}
                                  onChange={(event) =>
                                    this.handleRowInputChange(
                                      event,
                                      index,
                                      "amtChar"
                                    )
                                  }
                                />
                              </span>
                            </div>
                          </div>
                          <div className="vertical-line"></div>
                          <div className="list-block-column-removebutton">
                            {index !== 0 && (
                              <div onClick={() => this.removeRow(index)}>
                                <Close className="icon" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="btn-primary" onClick={this.addRow}>
                      Add Row
                    </button>
                  </div>
                </div>

                <div className="create-settelment-rates-block ">
                  <div className="total-amount-countainer ">
                    {dropdownValue === "Partial Change" ||
                    dropdownValue === "Full Changes" ? (
                      <div className="total-amt-input">
                        <p> Total Amount- </p>
                        <input
                          type="text"
                          className="inputFeild total-amt"
                          value={this.state.totalAmount}
                          onChange={(event) =>
                            this.setState({ totalAmount: event.target.value })
                          }
                        />
                      </div>
                    ) : isEditing ? (
                      <p>
                        Total Amount - {apiPreview.total_vol}
                        {` `}
                        {ratedata.currency}
                      </p>
                    ) : (
                      <p>
                        Total Amount - {`0000 `}
                        {ratedata.currency}
                      </p>
                    )}
                  </div>
                  <div className="create-settelments-horizontal-line"></div>
                  <div className="create-settelment-rates-list">
                    <div className="create-settelment-rates-list-title">
                      <ul>
                        <li>MDR Base Rates</li>
                        <li>Approved Transaction Fee</li>
                        <li>Decline Transaction Fee</li>
                        <li>Refund Fee</li>
                        <li>Chargeback Fee</li>
                        <li>Rolling Reserve</li>
                        <li>Settlement Fee</li>
                      </ul>
                    </div>
                    <div className="create-settelment-rates-list-rates">
                      <div className="create-settelment-rates-list-FeeRates">
                        {ratedata == null ? (
                          <p>Fee Rates{` (${ratedata.currency})`}</p>
                        ) : (
                          <p>Fee Rates</p>
                        )}
                        <ul>
                          <li>{ratedata.MDR}</li>
                          <li>{ratedata.txn_app}</li>
                          <li>{ratedata.txn_dec}</li>
                          <li>{ratedata.refund_fee}</li>
                          <li>{ratedata.chargeback_fee}</li>
                          <li>{ratedata.RR}</li>
                          <li>{ratedata.settlement_fee}</li>
                        </ul>
                      </div>
                      <div className="rates-divider">
                        <ul>
                          <li>-</li>
                          <li>-</li>
                          <li>-</li>
                          <li>-</li>
                          <li>-</li>
                          <li>-</li>
                          <li>-</li>
                        </ul>
                      </div>
                      <div className="create-settelment-rates-list-amounts">
                        {dropdownValue === "Full Changes" ? (
                          <div>
                            <p>Amounts</p>
                            <ul>
                              <li>
                                <input
                                  type="text"
                                  className="inputFeild amt-input"
                                  name="MDR"
                                  value={amounts[0].MDR}
                                  onChange={this.handleAmountChange}
                                />
                              </li>
                              <li>
                                <input
                                  type="text"
                                  className="inputFeild amt-input"
                                  name="Approved"
                                  value={amounts[0].Approved}
                                  onChange={this.handleAmountChange}
                                />
                              </li>
                              <li>
                                <input
                                  type="text"
                                  name="Decline"
                                  className="inputFeild amt-input"
                                  value={amounts[0].Decline}
                                  onChange={this.handleAmountChange}
                                />
                              </li>
                              <li>
                                <input
                                  type="text"
                                  name="Refund"
                                  className="inputFeild amt-input"
                                  value={amounts[0].Refund}
                                  onChange={this.handleAmountChange}
                                />
                              </li>
                              <li>
                                <input
                                  type="text"
                                  name="Chargeback"
                                  className="inputFeild amt-input"
                                  value={amounts[0].Chargeback}
                                  onChange={this.handleAmountChange}
                                />
                              </li>
                              <li>
                                <input
                                  type="text"
                                  name="RR"
                                  className="inputFeild amt-input"
                                  value={amounts[0].RR}
                                  onChange={this.handleAmountChange}
                                />
                              </li>
                              <li>
                                <input
                                  type="text"
                                  name="settelment"
                                  className="inputFeild amt-input"
                                  value={amounts[0].settelment}
                                  onChange={this.handleAmountChange}
                                />
                              </li>
                            </ul>
                          </div>
                        ) : isEditing ? (
                          <div>
                            <p>Amounts</p>
                            <ul>
                              <li>{apiPreview.MDR_amount}</li>
                              <li>{apiPreview.app_amount}</li>
                              <li>{apiPreview.dec_amount}</li>
                              <li>{apiPreview.total_refund_amount}</li>
                              <li>{apiPreview.total_chargeback_amount}</li>
                              <li>{apiPreview.RR_amount}</li>
                              <li>{apiPreview.settlement_fee_amount}</li>
                            </ul>
                          </div>
                        ) : (
                          <div>
                            <p>Amounts</p>
                            <ul>
                              <li>{amounts[0].MDR}</li>
                              <li>{amounts[0].Approved}</li>
                              <li>{amounts[0].Decline}</li>
                              <li>{amounts[0].Refund}</li>
                              <li>{amounts[0].Chargeback}</li>
                              <li>{amounts[0].RR}</li>
                              <li>{amounts[0].settelment}</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {dropdownValue === "Full Changes" ? (
                  <div>
                    <div className="create-settelment-Fee-Total">
                      <p>Fee Total</p>
                      <p>
                        <input
                          type="text"
                          className="inputFeild total-amt"
                          value={amounts[0].totalfee}
                          onChange={(event) =>
                            this.handleChange(event, "totalfee")
                          }
                        />{" "}
                        {ratedata.currency}
                      </p>
                    </div>

                    <div className="create-settelment-Total">
                      <p>Settlement Total</p>
                      <p>
                        <input
                          type="text"
                          className="inputFeild total-amt"
                          value={amounts[0].setteltotal}
                          onChange={(event) =>
                            this.handleChange(event, "setteltotal")
                          }
                        />
                      </p>
                    </div>

                    <div className="create-settelment-Total">
                      <p>Settlement Total in USDT</p>
                      <p>
                        <input
                          type="text"
                          className="inputFeild total-amt"
                          value={amounts[0].setteltotalamt}
                          onChange={(event) =>
                            this.handleChange(event, "setteltotalamt")
                          }
                        />
                        USDT
                      </p>
                    </div>
                  </div>
                ) : isEditing ? (
                  <div>
                    <div className="create-settelment-Fee-Total">
                      <p>Fee Total</p>
                      <p>
                        {(
                          apiPreview.MDR_amount +
                          apiPreview.app_amount +
                          apiPreview.dec_amount +
                          apiPreview.total_refund_amount +
                          apiPreview.total_chargeback_amount +
                          apiPreview.RR_amount +
                          apiPreview.settlement_fee_amount
                        ).toFixed(3)}
                      </p>
                    </div>

                    <div className="create-settelment-Total">
                      <p>Settlement Total</p>
                      <p>{apiPreview.settlement_vol}</p>
                    </div>

                    <div className="create-settelment-Total">
                      <p>Settlement Total in USDT</p>
                      <p>
                        {(
                          apiPreview.settlement_vol *
                          parseFloat(this.state.usdTToEur)
                        ).toFixed(2)}{" "}
                        USDT
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="create-settelment-Fee-Total">
                      <p>Fee Total</p>
                      <p>
                        {amounts[0].totalfee} {ratedata.currency}
                      </p>
                    </div>

                    <div className="create-settelment-Total">
                      <p>Settlement Total</p>
                      <p>{amounts[0].setteltotal}</p>
                    </div>

                    <div className="create-settelment-Total">
                      <p>Settlement Total in USDT</p>
                      <p>
                        {(
                          amounts[0].setteltotal *
                          parseFloat(this.state.usdTToEur)
                        ).toFixed(2)}{" "}
                        USDT
                      </p>
                    </div>
                  </div>
                )}
                <div className="create-settelments-horizontal-line"></div>
                <div className="create-settelment-userNote">
                  <p>Note:</p>
                  <div>
                    <textarea
                      className="textarea-container"
                      id="textArea"
                      value={this.state.textArea}
                      disabled={!isNoteOpen}
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className=" create-settlement-right-container">
                <div className="row-cards create-settlement-right-header create-settlement-right-header-top">
                  <select
                    type="select"
                    className="inputFeild select-input"
                    value={this.state.dropdownValue}
                    onChange={this.handleDropdownChange}
                  >
                    <option value="Default">Default</option>
                    <option
                      value="Partial Change"
                      onClick={this.handleFullChange}
                    >
                      Partial Change
                    </option>
                    <option
                      value="Full Changes"
                      onClick={this.handlePartialChange}
                    >
                      Full Changes
                    </option>
                  </select>
                </div>

                <div className="row-cards create-settlement-right-header">
                  <button
                    className="btn-primary btn1"
                    onClick={this.handleGenerate}
                  >
                    <Create className="btn-icon white-icon" />
                    <p>Generate</p>
                  </button>
                  <div className="right-header-second-row">
                    <button
                      className="btn-secondary btn2"
                      onClick={this.handlePreview}
                    >
                      Preview
                    </button>
                    <button className="btn-secondary btn2 disabled-button">
                      Save
                    </button>
                  </div>
                  <button className="btn-primary btn3 disabled-button">
                    <Send className="btn-icon" />
                    <p>Send</p>
                  </button>
                </div>

                <div className="create-settlement-right-mid">
                  <p className="p2">Conversion Rates:</p>
                  <div className="rates-div">
                    <p>EUR to USD: </p>
                    <input
                      type="text"
                      id="eurToUsd"
                      value={this.state.eurToUsd}
                      className="inputFeild rates-input"
                      required
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="rates-div">
                    <p>USD to EUR: </p>
                    <input
                      type="text"
                      id="usdToEur"
                      value={this.state.usdToEur}
                      className="inputFeild rates-input"
                      required
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="rates-div">
                    <p>EUR to USDT: </p>
                    <input
                      type="text"
                      id="usdTToEur"
                      value={this.state.usdTToEur}
                      className="inputFeild rates-input"
                      required
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>

                <div className="create-settlement-right-bottom">
                  <p className="p2">Client Notes</p>
                  <div className="switch-container">
                    <input
                      className="react-switch-checkbox"
                      id={`react-switch-new`}
                      type="checkbox"
                      checked={isNoteOpen}
                      onClick={this.handleNoteToggle}
                    />
                    <label
                      className={`react-switch-label ${
                        isNoteOpen && "react-switch-label-select"
                      }`}
                      htmlFor={`react-switch-new`}
                    >
                      <span className={`react-switch-button`} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  }
}

export default CreateSettlement;
