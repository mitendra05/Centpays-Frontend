// import React, { Component } from 'react';
// import PropTypes from 'prop-types';

// class CustomTooltip extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       detailsWidth: 200,
//       left: '-70px', 
//     };
//   }

//   componentDidMount() {
//     this.updateDetailsWidth();
//   }

//   componentDidUpdate(prevProps) {
//     if (prevProps.details !== this.props.details) {
//       this.updateDetailsWidth();
//     }
//   }

//   updateDetailsWidth = () => {
//     const { details } = this.props;
//     if (typeof details === 'string') {
//       const wordCount = details.trim().split(/\s+/).length;
//       let detailsWidth = 200;
//       let left = '-70px';
//       if (wordCount > 25) {
//         detailsWidth = 350;
//         left = '-150px';
//       }
//       this.setState({ detailsWidth, left });
//     }
//   };

//   render() {
//     const { title, details, children, bullet } = this.props;
//     const { detailsWidth, left } = this.state;

//     return (
//       <div className="custom-tooltip-container">
//         <div className="custom-tooltip-content">
//           {title && <h3 className="custom-tooltip-title">{title}</h3>}
//           {details && (
//             <p
//               className={`custom-tooltip-details ${bullet ? 'bullet' : ''}`}
//               style={{
//                 width: `${detailsWidth}px`,
//                 left: left,
//               }}
//             >
//               {bullet ? (
//                 <ul
//                   dangerouslySetInnerHTML={{
//                     __html: details,
//                   }}
//                 />
//               ) : (
//                 details
//               )}
//             </p>
//           )}
//           {children}
//         </div>
//       </div>
//     );
//   }
// }

// CustomTooltip.propTypes = {
//   title: PropTypes.string,
//   details: PropTypes.string,
//   children: PropTypes.node.isRequired,
//   bullet: PropTypes.bool,
// };

// export default CustomTooltip;


import React, { Component } from 'react';

class CustomTooltip extends Component {
  render() {
    const { title, details, children, bullet, maxWidth = 200 } = this.props;

    return (
      <div className="custom-tooltip-container">
        <div className="custom-tooltip-content">
          {title && <h3 className="custom-tooltip-title">{title}</h3>}
          {details && (
            <p
              className={`custom-tooltip-details ${bullet ? 'bullet' : ''}`}
              style={{width: `${maxWidth}px`, left: `-${maxWidth/2.5}px` }}
            >
              {bullet ? (
                <ul
                  dangerouslySetInnerHTML={{
                    __html: details,
                  }}
                />
              ) : (
                details
              )}
            </p>
          )}
          {children}
        </div>
      </div>
    );
  }
}

export default CustomTooltip;
