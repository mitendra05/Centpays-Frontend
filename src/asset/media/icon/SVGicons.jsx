import React from 'react';

export function CircleRing(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16"
            />
        </svg>
    );
}

export function Dashboard(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                d="M14 21a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1zM4 13a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1zm5-2V5H5v6zM4 21a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1zm1-2h4v-2H5zm10 0h4v-6h-4zM13 4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1zm2 1v2h4V5z"
            />
        </svg>
    );
}

export function MasterSettings(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                d="M2 18h7v2H2zm0-7h9v2H2zm0-7h20v2H2zm18.674 9.025l1.156-.391l1 1.732l-.916.805a4.014 4.014 0 0 1 0 1.658l.916.805l-1 1.732l-1.156-.391a4 4 0 0 1-1.435.83L19 21h-2l-.24-1.196a3.997 3.997 0 0 1-1.434-.83l-1.156.392l-1-1.732l.916-.805a4.014 4.014 0 0 1 0-1.658l-.916-.805l1-1.732l1.156.391c.41-.37.898-.655 1.435-.83L17 11h2l.24 1.196a3.99 3.99 0 0 1 1.434.83M18 18a2 2 0 1 0 0-4a2 2 0 0 0 0 4" />
        </svg>
    );
}


export function ManageMerchant(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                d="M12 14v2a6 6 0 0 0-6 6H4a8 8 0 0 1 8-8m0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6s6 2.685 6 6s-2.685 6-6 6m0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m2.595 7.811a3.505 3.505 0 0 1 0-1.622l-.992-.573l1-1.732l.992.573A3.498 3.498 0 0 1 17 14.645V13.5h2v1.145c.532.158 1.012.44 1.405.812l.992-.573l1 1.732l-.991.573a3.512 3.512 0 0 1 0 1.622l.991.573l-1 1.732l-.992-.573a3.495 3.495 0 0 1-1.405.812V22.5h-2v-1.145a3.495 3.495 0 0 1-1.405-.812l-.992.573l-1-1.732zM18 19.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3" />
        </svg>
    );
}

export function TestApi(props) {
  return (
      <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          {...props}
      >
          <path
              d="m19.56 12.098l1.532 2.652A3.5 3.5 0 0 1 18.061 20h-2.062v2.5l-5-3.5l5-3.5V18h2.062a1.5 1.5 0 0 0 1.299-2.25l-1.532-2.652zM7.304 9.134l.53 6.08l-2.165-1.25l-1.03 1.786A1.5 1.5 0 0 0 5.937 18h3.062v2H5.937a3.5 3.5 0 0 1-3.032-5.25l1.031-1.787l-2.165-1.249zm6.446-6.165a3.5 3.5 0 0 1 1.28 1.281l1.032 1.786l2.165-1.25l-.531 6.08l-5.531-2.58l2.165-1.25l-1.031-1.786a1.5 1.5 0 0 0-2.598 0L9.168 7.903l-1.732-1L8.968 4.25a3.5 3.5 0 0 1 4.78-1.281" />
      </svg>
  );
}


export function APIdoc(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                d="M10 8h4V6.5a3.5 3.5 0 1 1 3.5 3.5H16v4h1.5a3.5 3.5 0 1 1-3.5 3.5V16h-4v1.5A3.5 3.5 0 1 1 6.5 14H8v-4H6.5A3.5 3.5 0 1 1 10 6.5zM8 8V6.5A1.5 1.5 0 1 0 6.5 8zm0 8H6.5A1.5 1.5 0 1 0 8 17.5zm8-8h1.5A1.5 1.5 0 1 0 16 6.5zm0 8v1.5a1.5 1.5 0 1 0 1.5-1.5zm-6-6v4h4v-4z" />
        </svg>
    );
}

export function PaymentGateway(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
               d="M2 20h20v2H2zm2-8h2v7H4zm5 0h2v7H9zm4 0h2v7h-2zm5 0h2v7h-2zM2 7l10-5l10 5v4H2zm2 1.236V9h16v-.764l-8-4zM12 8a1 1 0 1 1 0-2a1 1 0 0 1 0 2" />
        </svg>
    );
}

export function ManageUser(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                d="M14 7a2 2 0 1 1-4 0a2 2 0 0 1 4 0m1 4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4h1.5v4h3v-4H15zm-3-9C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2M4 12a8 8 0 1 1 16 0a8 8 0 0 1-16 0" />
        </svg>
    );
}

export function TransactionReport(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                d="M21 8v4h-2V9h-5V4H5v16h6v2H3.993A.993.993 0 0 1 3 21.008V2.992C3 2.455 3.449 2 4.002 2h10.995zm-7.214 7.327c.039-.727.6-1.319 1.324-1.396l.87-.092a.495.495 0 0 0 .279-.124l.651-.585a1.483 1.483 0 0 1 1.923-.05l.682.55c.08.065.18.103.284.109l.874.047c.727.039 1.319.6 1.396 1.324l.092.87a.494.494 0 0 0 .124.279l.585.651c.487.542.508 1.357.05 1.923l-.55.682a.495.495 0 0 0-.109.284l-.047.874a1.483 1.483 0 0 1-1.324 1.396l-.87.092a.495.495 0 0 0-.279.124l-.651.585a1.483 1.483 0 0 1-1.923.05l-.682-.55a.495.495 0 0 0-.284-.109l-.874-.047a1.483 1.483 0 0 1-1.396-1.324l-.092-.87a.495.495 0 0 0-.124-.279l-.585-.651a1.483 1.483 0 0 1-.05-1.923l.55-.682a.495.495 0 0 0 .109-.284zm7.244 1.703l-1.06-1.06l-2.47 2.47l-1.47-1.47l-1.06 1.06l2.53 2.53z" />
        </svg>
    );
}

export function TransactionMonitoring(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
               d="M2 4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm2 1v14h16V5zm2 2h6v6H6zm2 2v2h2V9zm6 0h4V7h-4zm4 4h-4v-2h4zM6 15v2h12v-2z" />
        </svg>
    );
}

export function ManageSettlement(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                d="M20 2a1 1 0 0 1 1 1v3.757l-2 2V4H5v16h14v-2.758l2-2V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm1.778 6.808l1.414 1.414L15.414 18l-1.416-.002l.002-1.412zM13 12v2H8v-2zm3-4v2H8V8z" />
        </svg>
    );    
}

export function LeftSign(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                 d="m10.828 12l4.95 4.95l-1.414 1.415L8 12l6.364-6.364l1.414 1.414z"/>
        </svg>
    );    
}

export function RightSign(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                 d="m13.172 12l-4.95-4.95l1.414-1.413L16 12l-6.364 6.364l-1.414-1.415z"/>
        </svg>
    );    
}

export function DownSign(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
               d="m12 13.171l4.95-4.95l1.414 1.415L12 16L5.636 9.636L7.05 8.222z" />
        </svg>
    );    
}

export function UpSign(props) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" 
        {...props}
      >
        <path
          d="m12 10.828l-4.95 4.95l-1.414-1.414L12 8l6.364 6.364l-1.414 1.414z"
        />
      </svg>
    );
  }

  export function Search(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
          d="M11 2c4.968 0 9 4.032 9 9s-4.032 9-9 9s-9-4.032-9-9s4.032-9 9-9m0 16c3.867 0 7-3.133 7-7s-3.133-7-7-7s-7 3.133-7 7s3.133 7 7 7m8.485.071l2.829 2.828l-1.415 1.415l-2.828-2.829z"
        />
      </svg>
    );
  }

export function Oops(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                d="M12 2c5.523 0 10 4.477 10 10c0 .727-.078 1.435-.225 2.118l-1.782-1.783a8 8 0 1 0-4.374 6.801a3.998 3.998 0 0 0 1.555 1.423A9.955 9.955 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2m7 12.172l1.414 1.414a2 2 0 1 1-2.93.11l.102-.11zM12 15c1.466 0 2.785.631 3.7 1.637l-.945.86C13.965 17.182 13.018 17 12 17c-1.018 0-1.965.183-2.755.496l-.945-.86A4.987 4.987 0 0 1 12 15m-3.5-5a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m7 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3" />
        </svg>
    );
}

  export function LeftArrow(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
          d="M7.828 11H20v2H7.828l5.364 5.364l-1.414 1.414L4 12l7.778-7.778l1.414 1.414z"
        />
      </svg>
    );
  }

  export function RightArrow(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
          d="m16.172 11l-5.364-5.364l1.414-1.414L20 12l-7.778 7.778l-1.414-1.414L16.172 13H4v-2z"
        />
      </svg>
    );
  }

  export function UpArrow(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
          d="M13 7.828V20h-2V7.828l-5.364 5.364l-1.414-1.414L12 4l7.778 7.778l-1.414 1.414z"
        />
      </svg>
    );
  }

  export function DownArrow(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
          d="m13 16.172l5.364-5.364l1.414 1.414L12 20l-7.778-7.778l1.414-1.414L11 16.172V4h2z" 
        />
      </svg>
    );
  }
 
  export function Reset(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
          d="M5.463 4.433A9.961 9.961 0 0 1 12 2c5.523 0 10 4.477 10 10c0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228zm13.074 15.134A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0 0 13.54 5.772z"
        />
      </svg>
    );
  }

  export function Infoicon(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
          d="M13.5 4A1.5 1.5 0 0 0 12 5.5A1.5 1.5 0 0 0 13.5 7A1.5 1.5 0 0 0 15 5.5A1.5 1.5 0 0 0 13.5 4m-.36 4.77c-1.19.1-4.44 2.69-4.44 2.69c-.2.15-.14.14.02.42c.16.27.14.29.33.16c.2-.13.53-.34 1.08-.68c2.12-1.36.34 1.78-.57 7.07c-.36 2.62 2 1.27 2.61.87c.6-.39 2.21-1.5 2.37-1.61c.22-.15.06-.27-.11-.52c-.12-.17-.24-.05-.24-.05c-.65.43-1.84 1.33-2 .76c-.19-.57 1.03-4.48 1.7-7.17c.11-.64.41-2.04-.75-1.94"
        />
      </svg>
    );
  }

  export function Excel(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
          d="m2.859 2.877l12.57-1.795a.5.5 0 0 1 .571.494v20.848a.5.5 0 0 1-.57.494L2.858 21.123a1 1 0 0 1-.859-.99V3.867a1 1 0 0 1 .859-.99M4 4.735v14.53l10 1.429V3.306zM17 19h3V5h-3V3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4zm-6.8-7l2.8 4h-2.4L9 13.714L7.4 16H5l2.8-4L5 8h2.4L9 10.286L10.6 8H13z"
        />
      </svg>
    );
  }

  export function PlusSymbol(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
          d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
        />
      </svg>
    );
  }

  export function DarkMode(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
          d="M10 6a8 8 0 0 0 11.955 6.956C21.474 18.03 17.2 22 12 22C6.477 22 2 17.523 2 12c0-5.2 3.97-9.474 9.044-9.955A7.963 7.963 0 0 0 10 6m-6 6a8 8 0 0 0 8 8a8.006 8.006 0 0 0 6.957-4.045c-.316.03-.636.045-.957.045c-5.523 0-10-4.477-10-10c0-.321.015-.64.045-.957A8.006 8.006 0 0 0 4 12m14.164-9.709L19 2.5v1l-.836.209a2 2 0 0 0-1.455 1.455L16.5 6h-1l-.209-.836a2 2 0 0 0-1.455-1.455L13 3.5v-1l.836-.209A2 2 0 0 0 15.29.836L15.5 0h1l.209.836a2 2 0 0 0 1.455 1.455m5 5L24 7.5v1l-.836.209a2 2 0 0 0-1.455 1.455L21.5 11h-1l-.209-.836a2 2 0 0 0-1.455-1.455L18 8.5v-1l.836-.209a2 2 0 0 0 1.455-1.455L20.5 5h1l.209.836a2 2 0 0 0 1.455 1.455"
        />
      </svg>
    );
  }

  export function LightMode(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
         d="M12 18a6 6 0 1 1 0-12a6 6 0 0 1 0 12m0-2a4 4 0 1 0 0-8a4 4 0 0 0 0 8M11 1h2v3h-2zm0 19h2v3h-2zM3.515 4.929l1.414-1.414L7.05 5.636L5.636 7.05zM16.95 18.364l1.414-1.414l2.121 2.121l-1.414 1.414zm2.121-14.85l1.414 1.415l-2.121 2.121l-1.414-1.414zM5.636 16.95l1.414 1.414l-2.121 2.121l-1.414-1.414zM23 11v2h-3v-2zM4 11v2H1v-2z"
        />
      </svg>
    );
  }

  export function Notification(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
        d="M5 18h14v-6.969C19 7.148 15.866 4 12 4s-7 3.148-7 7.031zm7-16c4.97 0 9 4.043 9 9.031V20H3v-8.969C3 6.043 7.03 2 12 2M9.5 21h5a2.5 2.5 0 0 1-5 0"
        />
      </svg>
    );
  }

  export function ShortCut(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
        d="m12 .5l4.226 6.183l7.186 2.109l-4.575 5.93l.216 7.486L12 19.69l-7.054 2.518l.216-7.486l-4.575-5.93l7.187-2.109zm0 3.544L9.022 8.402L3.957 9.887l3.225 4.179l-.153 5.274l4.97-1.774l4.97 1.774l-.151-5.274l3.224-4.179l-5.065-1.485zM10 12a2 2 0 1 0 4 0h2a4 4 0 0 1-8 0z"
        />
      </svg>
    );
  }

  export function Close(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
        d="m12 10.587l4.95-4.95l1.414 1.414l-4.95 4.95l4.95 4.95l-1.415 1.414l-4.95-4.95l-4.949 4.95l-1.414-1.415l4.95-4.95l-4.95-4.95L7.05 5.638z"
        />
      </svg>
    );
  }

  export function RateIcon(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
        d="m16.757 2.997l-2 2H5v14h14V9.239l2-2v12.758a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1zm3.728-.9L21.9 3.511l-9.193 9.193l-1.412.002l-.002-1.416z"
        />
      </svg>
    );
  }

  export function ActiveUserIcon(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
        d="M14 14.252v2.09A6 6 0 0 0 6 22H4a8 8 0 0 1 10-7.749M12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6s6 2.685 6 6s-2.685 6-6 6m0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m5.793 8.914l3.535-3.535l1.415 1.414l-4.95 4.95l-3.536-3.536l1.415-1.414z"
        />
      </svg>
    );
  }

  export function InactiveUserIcon(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
        d="M14 14.252v2.09A6 6 0 0 0 6 22H4a8 8 0 0 1 10-7.749M12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6s6 2.685 6 6s-2.685 6-6 6m0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m7 6.586l2.121-2.121l1.415 1.414L20.414 19l2.121 2.121l-1.414 1.415L19 20.414l-2.121 2.121l-1.415-1.414L17.587 19l-2.121-2.121l1.414-1.415z"
        />
      </svg>
    );
  }

  export function PendingUserIcon(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        // width="24"
        // height="24"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
        d="M12 14v2a6 6 0 0 0-6 6H4a8 8 0 0 1 8-8m0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6s6 2.685 6 6s-2.685 6-6 6m0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m9.446 9.032l1.504 1.503l-1.415 1.415l-1.503-1.504a4 4 0 1 1 1.414-1.414M18 20a2 2 0 1 0 0-4a2 2 0 0 0 0 4"
        />
      </svg>
    );
  }

  export function TotalUserIcon(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
       d="M2 22a8 8 0 1 1 16 0h-2a6 6 0 0 0-12 0zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6s6 2.685 6 6s-2.685 6-6 6m0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m8.284 3.703A8.002 8.002 0 0 1 23 22h-2a6.001 6.001 0 0 0-3.537-5.473zm-.688-11.29A5.5 5.5 0 0 1 21 8.5a5.499 5.499 0 0 1-5 5.478v-2.013a3.5 3.5 0 0 0 1.041-6.609z"
        />
      </svg>
    );
  }

  export function ApprovalRatio(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
       d="M11 2.05v2.012a8.001 8.001 0 1 0 5.906 14.258l1.423 1.423A9.958 9.958 0 0 1 12 22C6.477 22 2 17.523 2 12c0-5.185 3.947-9.449 9-9.95M21.95 13a9.954 9.954 0 0 1-2.207 5.328l-1.423-1.422A7.96 7.96 0 0 0 19.938 13zM13.002 2.05a10.004 10.004 0 0 1 8.95 8.95h-2.013a8.004 8.004 0 0 0-6.937-6.938z"
        />
      </svg>
    );
  }

  export function CreaditCard(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
        d="M3.005 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m17 8h-16v8h16zm0-2V5h-16v4zm-6 6h4v2h-4z"
        />
      </svg>
    );
  }

  export function DollarCircle(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
       d="M12.005 22.003c-5.523 0-10-4.477-10-10s4.477-10 10-10s10 4.477 10 10s-4.477 10-10 10m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16m-3.5-6h5.5a.5.5 0 1 0 0-1h-4a2.5 2.5 0 1 1 0-5h1v-2h2v2h2.5v2h-5.5a.5.5 0 0 0 0 1h4a2.5 2.5 0 0 1 0 5h-1v2h-2v-2h-2.5z"
        />
      </svg>
    );
  }

  // View Merchant
  export function User(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        // width="20"
        // height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
       d="M20 22h-2v-2a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v2H4v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5zm-8-9a6 6 0 1 1 0-12a6 6 0 0 1 0 12m0-2a4 4 0 1 0 0-8a4 4 0 0 0 0 8"
        />
      </svg>
    );
  }

  export function Id(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
       d="M7.39 16.539a8 8 0 1 1 9.221 0l2.083 4.76a.5.5 0 0 1-.459.701H5.765a.5.5 0 0 1-.459-.7zm6.735-.693l1.332-.941a6 6 0 1 0-6.913 0l1.331.941L8.058 20h7.884zM8.119 10.97l1.94-.485a2 2 0 0 0 3.882 0l1.94.485a4.002 4.002 0 0 1-7.762 0"
        />
      </svg>
    );
  }

  export function URL(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
       d="m13.06 8.111l1.415 1.414a7 7 0 0 1 0 9.9l-.354.353a7 7 0 1 1-9.9-9.9l1.415 1.415a5 5 0 1 0 7.071 7.071l.354-.354a5 5 0 0 0 0-7.07l-1.415-1.415zm6.718 6.01l-1.414-1.414a5 5 0 0 0-7.071-7.07l-.354.353a5 5 0 0 0 0 7.07l1.415 1.415l-1.415 1.414l-1.414-1.414a7 7 0 0 1 0-9.9l.354-.353a7 7 0 1 1 9.9 9.9"
        />
      </svg>
    );
  }

  export function Industry(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
       d="M21 21H3a1 1 0 0 1-1-1v-7.513a1 1 0 0 1 .343-.754L6 8.544V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1M9 19h3v-6.058L8 9.454l-4 3.488V19h3v-4h2zm5 0h6V5H8v2.127c.234 0 .469.082.657.247l5 4.359a1 1 0 0 1 .343.754zm2-8h2v2h-2zm0 4h2v2h-2zm0-8h2v2h-2zm-4 0h2v2h-2z"
        />
      </svg>
    );
  }

  export function Phone(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
      d="M9.366 10.682a10.556 10.556 0 0 0 3.952 3.952l.884-1.238a1 1 0 0 1 1.294-.296a11.421 11.421 0 0 0 4.583 1.364a1 1 0 0 1 .921.997v4.462a1 1 0 0 1-.898.995A15.51 15.51 0 0 1 18.5 21C9.94 21 3 14.06 3 5.5c0-.538.027-1.072.082-1.602A1 1 0 0 1 4.077 3h4.462a1 1 0 0 1 .997.921A11.421 11.421 0 0 0 10.9 8.504a1 1 0 0 1-.296 1.294zm-2.522-.657l1.9-1.357A13.41 13.41 0 0 1 7.647 5H5.01c-.006.166-.009.333-.009.5C5 12.956 11.044 19 18.5 19c.167 0 .334-.003.5-.01v-2.637a13.41 13.41 0 0 1-3.668-1.097l-1.357 1.9a12.45 12.45 0 0 1-1.588-.75l-.058-.033a12.556 12.556 0 0 1-4.702-4.702l-.033-.058a12.441 12.441 0 0 1-.75-1.588"
        />
      </svg>
    );
  }

  export function Email(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
     d="M2.243 6.854L11.49 1.31a1 1 0 0 1 1.028 0l9.24 5.545a.5.5 0 0 1 .242.429V20a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.283a.5.5 0 0 1 .243-.429M4 8.133V19h16V8.132l-7.996-4.8zm8.06 5.565l5.296-4.463l1.288 1.53l-6.57 5.537l-6.71-5.53l1.272-1.544z"
        />
      </svg>
    );
  }

  export function Skype(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
      d="M13.005 18.423a2 2 0 0 1 1.237.207a3.25 3.25 0 0 0 4.389-4.389a2 2 0 0 1-.207-1.237a6.5 6.5 0 0 0-7.427-7.427A2 2 0 0 1 9.76 5.37a3.25 3.25 0 0 0-4.389 4.39a2 2 0 0 1 .207 1.237a6.5 6.5 0 0 0 7.427 7.427M12.001 20.5a8.5 8.5 0 0 1-8.4-9.81a5.25 5.25 0 0 1 7.09-7.09a8.5 8.5 0 0 1 9.71 9.71a5.25 5.25 0 0 1-7.09 7.09c-.427.066-.865.1-1.31.1m.053-3.5C9.252 17 8 15.62 8 14.586c0-.532.39-.902.928-.902c1.2 0 .887 1.725 3.125 1.725c1.143 0 1.776-.624 1.776-1.261c0-.384-.188-.808-.943-.995l-2.49-.624c-2.006-.504-2.37-1.592-2.37-2.612C8.027 7.797 10.019 7 11.89 7c1.72 0 3.755.956 3.755 2.228c0 .545-.479.863-1.011.863c-1.023 0-.835-1.418-2.9-1.418c-1.023 0-1.596.462-1.596 1.126c0 .663.803.876 1.502 1.035l1.836.409C15.49 11.695 16 12.876 16 13.989C16 15.713 14.675 17 12.015 17z"
        />
      </svg>
    );
  }

  export function Address(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
      d="m12 23.728l-6.364-6.364a9 9 0 1 1 12.728 0zm4.95-7.778a7 7 0 1 0-9.9 0L12 20.9zM12 13a2 2 0 1 1 0-4a2 2 0 0 1 0 4"
        />
      </svg>
    );
  }

  export function BusinessInfo(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"    
        {...props}
      >
        <path
      d="M11.861 2.39a3 3 0 0 1 3.275-.034L19.29 5H21a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-1.52a2.65 2.65 0 0 1-1.285 2.449l-5.093 3.056a2 2 0 0 1-2.07-.008a2 2 0 0 1-2.561.073l-5.14-4.039a2.001 2.001 0 0 1-.565-2.446A2 2 0 0 1 2 13.51V6a1 1 0 0 1 1-1h4.947zM4.173 13.646l.692-.605a3 3 0 0 1 4.195.24l2.702 2.972a3 3 0 0 1 .396 3.487l5.009-3.005a.657.657 0 0 0 .278-.79l-4.427-6.198a1 1 0 0 0-1.101-.377l-2.486.745a3 3 0 0 1-2.983-.752l-.293-.292A1.997 1.997 0 0 1 5.68 7H4v6.51zm9.89-9.602a1 1 0 0 0-1.093.012l-5.4 3.6l.292.293a1 1 0 0 0 .995.25l2.485-.745a3 3 0 0 1 3.303 1.13L18.515 14H20V7h-.709a2 2 0 0 1-1.074-.313zM6.181 14.545l-1.616 1.414l5.14 4.039l.705-1.232a1 1 0 0 0-.129-1.169L7.58 14.625a1 1 0 0 0-1.398-.08"
        />
      </svg>
    );
  }

export function DirectorInfo(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
   d="M4 22a8 8 0 1 1 16 0zm9-5.917V20h4.659A6.008 6.008 0 0 0 13 16.083M11 20v-3.917A6.008 6.008 0 0 0 6.341 20zm1-7c-3.315 0-6-2.685-6-6s2.685-6 6-6s6 2.685 6 6s-2.685 6-6 6m0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4"
      />
    </svg>
  );
}

export function MerchantRates(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
        d="m10.904 2.1l9.9 1.414l1.414 9.9l-9.192 9.192a1 1 0 0 1-1.415 0l-9.9-9.9a1 1 0 0 1 0-1.413zm.707 2.122L3.833 12l8.485 8.485l7.779-7.778l-1.061-7.425zm2.122 6.363a2 2 0 1 1 2.828-2.828a2 2 0 0 1-2.828 2.829"
      />
    </svg>
  );
}

export function MerchantSettlements(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
        d="M9 18H4v-8h5zm6 0h-5V6h5zm6 0h-5V2h5zm1 4H3v-2h19z"
      />
    </svg>
  );
}

export function PieChart(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
        d="M12 .5C18.351.5 23.5 5.649 23.5 12c0 .337-.015.67-.043 1h-1.506c-.502 5.053-4.766 9-9.951 9c-5.523 0-10-4.477-10-10c0-5.185 3.947-9.449 9-9.95V.542c.33-.029.663-.043 1-.043m-1 3.562A8.001 8.001 0 0 0 12 20a8.001 8.001 0 0 0 7.938-7H11zm2-1.51V11h8.448A9.503 9.503 0 0 0 13 2.552" 
      />
    </svg>
  );
}

export function Calendar(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
        d="M9 1v2h6V1h2v2h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4V1zm11 10H4v8h16zM8 14v2H6v-2zm10 0v2h-8v-2zM7 5H4v4h16V5h-3v2h-2V5H9v2H7z"
      />
    </svg>
  );
}

export function Traffic(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
        d="M19 20H5v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V11l2.48-5.788A2 2 0 0 1 6.32 4h11.36a2 2 0 0 1 1.838 1.212L22 11v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1zm1-7H4v5h16zM4.176 11h15.648l-2.143-5H6.32zM6.5 17a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m11 0a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3"
      />
    </svg>
  );
}

export function Wallet(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
        d="M18.005 7h3a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h15zm-14 2v10h16V9zm0-4v2h12V5zm11 8h3v2h-3z"
      />
    </svg>
  );
}

export function BarChart(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
        d="M3 12h4v9H3zm14-4h4v13h-4zm-7-6h4v19h-4z"
      />
    </svg>
  );
}

export function Article(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
        d="M20 22H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1m-1-2V4H5v16zM7 6h4v4H7zm0 6h10v2H7zm0 4h10v2H7zm6-9h4v2h-4z"
      />
    </svg>
  );
}

export function Create(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
        d="M4 1v3H1v2h3v3h2V6h3V4H6V1zM3 20.007V11h2v8h8v-5c0-.55.45-1 1-1l5-.001V5h-8V3h9.007c.548 0 .993.456.993 1.002V15l-6 5.996L4.002 21A.998.998 0 0 1 3 20.007m15.171-5.008L15 15v3.169z"
      />
    </svg>
  );
}

export function Attachment(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
        d="m14.829 7.757l-5.657 5.657a1 1 0 1 0 1.414 1.414l5.657-5.656A3 3 0 0 0 12 4.929l-5.657 5.657a5 5 0 0 0 7.071 7.07L19.071 12l1.414 1.414l-5.656 5.657a7 7 0 0 1-9.9-9.9l5.657-5.656a5 5 0 0 1 7.071 7.07L12 16.244A3 3 0 0 1 7.758 12l5.656-5.657z"
      />
    </svg>
  );
}

export function Send(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
        d="m21.727 2.957l-5.454 19.086c-.15.529-.475.553-.717.07L11 13L1.923 9.37c-.51-.205-.503-.51.034-.689L21.043 2.32c.529-.176.832.12.684.638m-2.692 2.14L6.812 9.17l5.637 2.255l3.04 6.08z"
      />
    </svg>
  );
}

export function More(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
        d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m0 14c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m0-7c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2"
      />
    </svg>
  );
}

export function MailStatus(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
       d="M21 3a1 1 0 0 1 1 1v16.007a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V19h18V7.3l-8 7.2l-10-9V4a1 1 0 0 1 1-1zM8 15v2H0v-2zm-3-5v2H0v-2zm14.566-5H4.434L12 11.81z"
      />
    </svg>
  );
}

export function CheckMark(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
       d="m10 15.17l9.192-9.191l1.414 1.414L10 17.999l-6.364-6.364l1.414-1.414z"
      />
    </svg>
  );
}

export function UpDoubleArrow(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
       d="m12 4.836l-6.207 6.207l1.414 1.414L12 7.664l4.793 4.793l1.414-1.414zm0 5.65l-6.207 6.207l1.414 1.414L12 13.314l4.793 4.793l1.414-1.414z"
      />
    </svg>
  );
}

export function DownDoubleArrow(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
       d="m12 19.164l6.207-6.207l-1.414-1.414L12 16.336l-4.793-4.793l-1.414 1.414zm0-5.65l6.207-6.207l-1.414-1.414L12 10.686L7.207 5.893L5.793 7.307z"
      />
    </svg>
  );
}

export function RightDoubleArrow(props) {
	return (
  <svg 
  xmlns="http://www.w3.org/2000/svg" 
  width="20" 
  height="20" 
  viewBox="0 0 24 24" 
  {...props}
  >
    <path 
    d="m19.164 12l-6.207-6.207l-1.414 1.414L16.336 12l-4.793 4.793l1.414 1.414zm-5.65 0L7.307 5.793L5.893 7.207L10.686 12l-4.793 4.793l1.414 1.414z"/>
  </svg>
  );
}

export function LeftDoubleArrow(props) {
	return (
  <svg 
  xmlns="http://www.w3.org/2000/svg" 
  width="20" 
  height="20" 
  viewBox="0 0 24 24" 
  {...props}
  >
    <path d="m4.836 12l6.207 6.207l1.414-1.414L7.664 12l4.793-4.793l-1.414-1.414zm5.65 0l6.207 6.207l1.414-1.414L13.314 12l4.793-4.793l-1.414-1.414z"/>
  </svg>
  );
}

export function Folder(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
       d="M13.414 5H20a1 1 0 0 1 1 1v1H3V4a1 1 0 0 1 1-1h7.414zM3.087 9h17.826a1 1 0 0 1 .997 1.083l-.833 10a1 1 0 0 1-.997.917H3.92a1 1 0 0 1-.996-.917l-.834-10A1 1 0 0 1 3.087 9"
      />
    </svg>
  );
}

export function Logout(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
       d="M5 22a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3h-2V4H6v16h12v-2h2v3a1 1 0 0 1-1 1zm13-6v-3h-7v-2h7V8l5 4z"
      />
    </svg>
  );
}

export function Eye(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
       d="M12 3c5.392 0 9.878 3.88 10.819 9c-.94 5.12-5.427 9-10.819 9s-9.878-3.88-10.818-9C2.122 6.88 6.608 3 12 3m0 16a9.005 9.005 0 0 0 8.778-7a9.005 9.005 0 0 0-17.555 0A9.005 9.005 0 0 0 12 19m0-2.5a4.5 4.5 0 1 1 0-9a4.5 4.5 0 0 1 0 9m0-2a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5"
      />
    </svg>
  );
}

export function EyeOff(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
       d="M17.883 19.297A10.95 10.95 0 0 1 12 21c-5.392 0-9.878-3.88-10.818-9A11 11 0 0 1 4.52 5.935L1.394 2.808l1.414-1.414l19.799 19.798l-1.414 1.415zM5.936 7.35A8.97 8.97 0 0 0 3.223 12a9.005 9.005 0 0 0 13.201 5.838l-2.028-2.028A4.5 4.5 0 0 1 8.19 9.604zm6.978 6.978l-3.242-3.241a2.5 2.5 0 0 0 3.241 3.241m7.893 2.265l-1.431-1.431A8.9 8.9 0 0 0 20.778 12A9.005 9.005 0 0 0 9.552 5.338L7.974 3.76C9.221 3.27 10.58 3 12 3c5.392 0 9.878 3.88 10.819 9a10.95 10.95 0 0 1-2.012 4.593m-9.084-9.084Q11.86 7.5 12 7.5a4.5 4.5 0 0 1 4.492 4.778z"/>
    </svg>
  );
}

export function Copy(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
       d="M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1 1 0 0 1 3 21l.003-14c0-.552.45-1 1.006-1zM5.002 8L5 20h10V8zM9 6h8v10h2V4H9z"
      />
    </svg>
  );
}

export function Import(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
       d="M21 3H3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1m-9 13a3 3 0 0 1-3-3H4V5h16v8h-5a3 3 0 0 1-3 3m4-7h-3V6h-2v3H8l4 4.5z"
      />
    </svg>
  );
}

export function Export(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
       d="M21 3H3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1m-9 13a3 3 0 0 1-3-3H4V5h16v8h-5a3 3 0 0 1-3 3m4-5h-3v3h-2v-3H8l4-4.5z"
      />
    </svg>
  );
}

export function Bin(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
       d="M17 4h5v2h-2v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6H2V4h5V2h10zM9 9v8h2V9zm4 0v8h2V9z"
      />
    </svg>
  );
}

export function Ascending(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
       d="M2.22 2.72a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1-1.06 1.06l-.72-.72v7.69a.75.75 0 0 1-1.5 0V5.06l-.72.72A.75.75 0 0 1 .22 4.72zM7 12.75c0 .414.336.75.75.75h7.5a.75.75 0 0 0 0-1.5h-7.5a.75.75 0 0 0-.75.75m.75-4a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 0 1.5zm0-4.75a.75.75 0 0 1 0-1.5h2.5a.75.75 0 0 1 0 1.5z"       />
    </svg>
  );
}

export function Descending(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
      d="M2.22 13.28a.75.75 0 0 0 1.06 0l2-2a.75.75 0 1 0-1.06-1.06l-.72.72V3.25a.75.75 0 0 0-1.5 0v7.69l-.72-.72a.75.75 0 1 0-1.06 1.06zM7 3.25a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7 3.25m.75 4a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5zm0 4.75a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5z"      />
    </svg>
  );
}


export function ExportIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
       d="M10 3v2H5v14h14v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm7.586 2H13V3h8v8h-2V6.414l-7 7L10.586 12z"
       />
    </svg>
  );
}


export function DoubleTick(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
       d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16m-.997-4L6.76 11.757l1.414-1.414l2.829 2.829l5.657-5.657l1.414 1.414z"
       />
    </svg>
  );
}


export function Delete(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"    
      {...props}
    >
      <path
       d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1zm1 2H6v12h12zm-4.586 6l1.768 1.768l-1.414 1.414L12 15.414l-1.768 1.768l-1.414-1.414L10.586 14l-1.768-1.768l1.414-1.414L12 12.586l1.768-1.768l1.414 1.414zM9 4v2h6V4z"
       />
    </svg>
  );
}