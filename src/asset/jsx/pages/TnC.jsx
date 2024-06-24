import React, { Component } from "react";
import fullLogo from "../../media/image/centpays_full_logo.png";
import tree1 from "../../media/image/bg-tree-1.png";
import tree2 from "../../media/image/bg-tree-2.png";
import backButton from "../../media/icon/singLeft.png";
import "../../style/main.css";

class Tnc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: "Terms and Conditions",
            content: {
                "Terms and Conditions": `Following Terms and Conditions (Terms and Conditions) are a lawful irrevocable agreement between you, the person or any establishment that will be obtaining or using our website and/or services (referenced below as You or Your), and Centpays (the Company or We or Us), with regard to the use of the Companys website at CENTPAYS.COM or any additional online platform available to You by Company (the Website). By using the Company Website you accept the Terms and Conditions in this regard. The Company has the right to set aside, in its sole circumspection, to amend these Terms and Conditions at any time by posting the amended provisions on the Website, and You shall be accountable for evaluating and staying updated with any such amendments. Please bear in mind that any such amendment shall become effective at once upon posting. IF YOU DO NOT WISH TO COMPLY TO ALL OF THESE TERMS AND CONDITIONS, YOU SHOULD NOT OPERATE THE WEBSITE.`,
                "Prohibited use": `2.1 You by virtue of this accept that You will not, and will not allow or authorize any third party or parties to operate the Website in any course of action that:
                (i) is libellous, insulting, harassing, threatening, discriminatory in any way, or account for an invasion of a right of privacy of another person, or otherwise derogatory, vicious, vulgar, vile, or otherwise injures or can considerately be probable to injure any person or organization;
                (ii) is barred by law or promotes unlawful activity, as well as without limitation, any economic offences by any individual or entity included in any punishment list;
                (iii) post or send any communication or solicitation planned or intended to acquire private information from any third party or parties;
                (iv) contain any ailment such as trojan horse, worm, or any other computer software or operating system planned to intersperse, destroy, or restrict the performance of the Website or any system, computer software, hardware or any other information technology equipment;
                (v) acting as an imposter or imitate another person;
                (vi) Contravention or infringement of any rights (including, without limitation, privacy, copyright, or other intellectual property rights) of any third party; or
                (vii) Or Contravention of these Terms and Conditions and/or our Privacy Policy or any Service Agreement and any pertinent local, state, national or international law or regulation.
                2.2 In inclusion, except as expressly permitted in this regard, You will not, and will not permit or any third party or parties to:
                (i) take any measures with an intention to avoid or disable the functioning of any security attribute or measure of the Website;
                (ii) Produce, disperse, vend, reveal, market, reverse engineer, rent, lease, exhibit, furnish, transfer or make available any Company’s Content (as defined hereinafter) and/or the Website or any partial content from that circumstance or source, to any third party;
                (iii) sub-license, dismantle, improve, or apart from that alter or operate the source code of the Website or any part in this regard;
                (iv) Alter, copy, or generate unoriginal works from the Website or any part from that circumstance or source;
                (v) operate or use the Website via robotic means, including by crawling, scraping, caching, Bots or otherwise (except as may be the outcome of standard search engine protocols or technologies used by a search engine with our express assent).`,
                "Company and user content": `3.1 The Company reserves the right to hold on to all right, title, and interest in and to the Website (including all related intellectual property rights). Subject to these Terms and Conditions, the Company by virtue of this grants You a restrictive, distinctive, non-transferable, non-exclusive, non-assignable, authorization to use the Website, provided that You will not change or modify any part of the Website. Except as expressly on condition therein and included, no other rights or licenses, expressed or implied, are permitted to You by the Company in regard to the Website, including any part of its content and/or intellectual property right, whether registered or not. 3.2 All photos, texts, scripts, designs, graphics, logos, audios, videos, songs, interactive features, interfaces, software, code, trademarks, service marks, trade names and other content used, displayed, included, incorporated, uploaded, posted or published by the Company as part of the Website, are the sole possession of the Company and/or their licensors, and subject to copyright and other intellectual property rights under applicable laws, and You may not operate, download, dispense and/or copy them partially or wholly, without the prior written consent of the Company. For the sake of lucidity, you may not copy, reproduce, alter, publicly display, publicly perform, publish, distribute, sell, license, rent, transfer, reproduce, create unoriginal works based on, or utilize in any way, the Companys Content or any part from that circumstance or source.`,
                "General Terms of Service": `4.1 The Company has the right to set aside, switch, suspend, take deactivate or discontinue its website, at its sole option, at any schedule and unaccompanied notice or liability.
                4.2 You are exclusively accountable for the activity that takes place in connection to the Website by You or on Your representation. You must inform the Company at once for of any contravention of security or unwarranted operation of the Company's Website. The Company will not be accountable for any losses as a result of any operation of the Company’s Website.
                4.3 You are accountable for acquiring and maintaining any appliance, hardware, software or auxiliary services needed to access and operate the Website, and for any emolument asked in payment by third parties in this regard, as requisite, and the Company have no control or responsibility in this regard.
                4.4 If You address the Company with any feedbacks or recommendation concerning the Website, you allow that the Company may operate them at its sole option, without any commitment to compensate You in any mode for such feedbacks or recommendation.
                4.5 It is by virtue of this it is made clear that the Website may include any links to other third parties' websites, applications or attributes and/or other platforms, or referrals to certain third parties’ products, content or services that are not possessed or commanded by the Company and that the Company has no authority over them. If You opt to visit such third party’s websites, applications or attributes and/or other platforms, or use its products or services, kindly be conscious that such third party’s own terms of service and privacy policy will apply and control Your activities. The Company does not make any representation or warranty of any kind in respect of such third party's websites, applications, attributes, other platforms services, products or content. The Company also does not validate and does not guarantee that You will be pleased with any content, products or services that were rendered to you, bought or downloaded from such other third parties, and is not accountable or responsible in any mode for Your interactivity with such third parties.`,
                "Termination": `The Company may end or suspend the Website (or any part involved) at once, without earlier notice or liability and on its sole circumspection. All the provisions of these Terms and Conditions which by their identity should survive end (including, without limitation, ownership provisions, warranty refusal, indemnification commitment and limitations of liability) shall stay in full force and effect following end thereof. End of these Terms and Conditions shall not detach You from any duty resulting or arising prior to such end or limit any liability which You may have to the Company in other respect. If you have entered into a Service Agreement with the Company or any of its integrators, the end provisions in such Service Agreement shall bid, and, in inclusion, Company may end Your operation of the Website and service at any time upon infringement of these Terms and Conditions.`,
                "Warranty and Disclaimer": `YOU EXPRESSLY ACCEPT AND CONCUR THAT YOUR OPERATION OF THE WEBSITE IS AT YOUR SOLE PERIL AND THAT THE ENTIRE PERIL AS TO ADEQUATE STANDARD, PERFORMANCE, CORRECTNESS AND ATTEMPT IS EXCLUSIVELY WITH YOU. THE WEBSITE IS ISSUED WITHOUT WARRANTY OF ANY FORM. THE COMPANY DOES NOT WARRANT THAT YOUR OPERATION OF THE WEBSITE WILL BE WITHOUT ANY INTERRUPTION, ACCURACY OR WILL MEET YOUR SPECIFIC NECESSITIES. THE COMPANY MAKES NO WARRANTY OR REPRESENTATION, EITHER EXPRESS OR IMPLIED, IN RESPECT OF THE WEBSITE, THE CONTENT AND YOUR OPERATION IN THIS REGARD, INCLUSIVE OF, BUT NOT RESTRICTED TO, ANY IMPLIED WARRANTIES OF STURDINESS FOR A PARTICULAR PURPOSE, ACCURACY, AVAILABILITY, SECURITY, COMPATIBILITY, NO CONTRAVENTION OR COMPLETENESS OF FEEDBACKS, OUTCOMES AND ABSENCE OF NEGLIGENCE.`,
                "Limitation of Liability": `IN NO EVENT SHALL THE COMPANY, ITS SHAREHOLDERS, DIRECTORS, OFFICERS OR EMPLOYEES, BE ACCOUNTABLE FOR ANY ONE’S OWN INJURY, OR ANY EXCEPTIONAL, SECONDARY, PUNITIVE, RESULTING OR INCIDENTAL DAMAGES, INCLUDING LABOR COSTS, LOSS OF DATA, LOSS OF GOODWILL, LOSS OF PROFITS, LOSS OF SAVINGS, LOSS OF BUSINESS INFORMATION, OR LOSS OF USE OR OTHER FINANCIAL LOSS, IN RELATION WITH OR APPEARING OUT OF THESE TERMS AND CONDITIONS, THE WEBSITE, ANY TRANSACTION, OR YOUR OPERATION OF OR INCAPABILITY TO OPERATE THE WEBSITE, NO MATTER HOW IT BRINGS ABOUT, ANY NOTION OF LIABILITY, IN ANY CASE OF WHETHER THE COMPANY HAS BEEN GUIDED OF THE POSSIBILITY OF SUCH DAMAGES. WITHOUT DETRACTING FROM THE ABOVE, IN NO CASE SHALL THE AGGREGATE LIABILITY OF THE COMPANY AND ITS SHAREHOLDERS, DIRECTORS, OFFICERS AND EMPLOYEES UNDER THE PUREVIEW OF THESE TERMS AND CONDITIONS OR APPEARING OUT OF OR OTHERWISE RELATED TO YOUR USE OF THE WEBSITE EXCEED THE LOSS INCURRED`,
                "Indemnification": `Upon its first request, You will indemnify and hold the Company, its shareholders, directors, officers and employees, free from any claim, liability, cost, loss, damage and expense (including reasonable litigation and court fees) resulting due to Your access and operation of the Website in infringement of these Terms and Conditions or in contravention or violation of any rights (including, without limitation, privacy right, copyright, or other intellectual property rights) of any third party and any applicable laws.`,
                "Miscellaneous": `9.1 These Terms and Conditions and it’s carrying out shall be controlled solely by Indian Laws and various Enactments, without consideration to dispute of law’s provisions and that would result in the application of the laws of any other jurisdiction. The parties for avoidance of any doubt submit the sole jurisdiction to the courts of INDIA
                9.2 These Terms and Conditions and our Privacy Policy account for the complete agreement between You and the Company with relation to the access and/or operation of the Website, and replace all prior or simultaneous understandings in respect of such subject matter. The Privacy Policy is available at: xxxxx(link)

                9.3 The Company reserves the right to update these Terms and Conditions from time to time, with or without notice, and will post its updated Terms and Conditions on its website. Your continued use of our website will be subject to the then-current Terms and Conditions. If any modification is unacceptable to You, you may cease using the Website. If You do not cease using the Website, you will be deemed to have accepted those modifications.
                9.4 The Company retains the right to amend these Terms and Conditions from time to time, with or without notice, and will post its amended Terms and Conditions on its website. Your constant use of our website will be subject to the amended Terms and Conditions. If any amendment is unacceptable to You, you may cease to operate the Website. If You do not cease to operate the Website, you will be considered to have impliedly accepted those amendments.
                9.5 These Terms and Conditions will also control any later upgrades or updates or new releases furnished by the Company in relation with the Website, unless any such upgrades or updates are followed by a distinctive set of terms and conditions, in which case the terms of that upgraded or updated terms and conditions will control.
                9.6 In the situation that a court of competent jurisdiction finds any provision of these Terms and Conditions to be unlawful, barred by law or unenforceable, the remaining provisions will continue to exist in full force and effect.
                9.7 The failure of the Company to exercise any right or provision in these Terms and Conditions will not lead to a waiver of such right or provision unless accepted and agreed by the Company in writing.
                
                If You have any questions or inquiry about these Terms and Conditions or our services in general, please do not stall to contact us via e-mail at: mailto:info@centpays.com`,
                "Usage rules": `1.1 When You operate our website, you act, authorize and accord that the information You provide Us is precise, absolute, and updated at all times. You assent thereto accept responsibility or liability for a part or all activities or act in connection with Your operation of our website. Your operation of our website is at Your own disposal and at Your exclusive threat and You will be exclusively responsible or accountable for any loss of data, destruction or harm to any of Your devices used to operate or access the Website. The particulars acquired by operating the Website is furnished without warranties of any category, whether express or implied, including, but not limited to, implied warranties for the intended purpose of a specific category, fitness for a particular purpose, title, right, regulation or law, or warranty of any kind. The Company, its branches and its associates do not warrant that a) the Website shall function without any interruption, secured or available at any given time or b) any error or flaw shall be rectified c) the outcomes of operating the Website shall link up your necessities. In addition, data or content transmitted to the Website may be lost, destroyed or else not recoverable.`,
            },
            activeItem: null
        };
        this.sectionRefs = {};
    }

    handleItemClick = (item) => {
        this.setState({ activeItem: item }, () => {
            const selectedElement = document.getElementById(item);
            selectedElement.scrollIntoView({ behavior: "smooth" });
        });
    };
    
    handleBackButtonClick = () => {
        window.location.href = "/signup"; 
    };

    componentDidMount() {
        this.createIntersectionObserver();
    }

    componentWillUnmount() {
        if (this.observer) { this.observer.disconnect(); }
    }

    createIntersectionObserver = () => {
        this.observer = new IntersectionObserver((entries) => {
            let foundActive = false;
            entries.forEach(entry => {
                if (entry.isIntersecting && !foundActive) {
                    this.setState(prevState => ({
                        activeItem: entry.target.id !== prevState.activeItem ? entry.target.id : prevState.activeItem
                    }));

                }
            });
        }, { threshold: 0.5 });

        Object.keys(this.state.content).forEach(item => {
            this.observer.observe(this.sectionRefs[item]);
        });
    };


    render() {
        const { activeItem, content } = this.state;
        return (
            <>
                <div id="auth">
                    <div className="auth-bg-top"></div>
                    <div className="auth-bg-bottom"></div>
                    <img className="tree1" src={tree1} alt="tree"></img>
                    <img className="tree2" src={tree2} alt="tree"></img>
                </div>
                <div className="auth-container">
                    <div className="auth-main-container terms-container">
                        <div className="terms-left">
                            <div className="back-button" onClick={() => this.handleBackButtonClick()}>
                                <img src={backButton} alt="Back" />
                            </div>
                            <div className="terms-list">
                                <ul>
                                    {Object.keys(content).map((item, index) => (

                                        <li
                                            key={index}
                                            onClick={() => this.handleItemClick(item)}
                                            className={activeItem === item ? 'active' : ''}              >
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="terms-right">
                            <div className="terms-logo-container">
                                <img className="terms-logo" src={fullLogo} alt="Centpays"></img>
                            </div>
                            <div className="scrollable-content">
                                {Object.keys(content).map((item, index) => (
                                    <div
                                        key={index}
                                        id={item}
                                        ref={ref => (this.sectionRefs[item] = ref)} >
                                        <h4>{item}</h4>
                                        <p className="terms-content">{content[item]}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default Tnc;