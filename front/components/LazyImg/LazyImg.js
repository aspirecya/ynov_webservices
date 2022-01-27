import * as React from "react";
import Image from "next/image";
const LazyImg = ({ src, alt, observe = false, ...props }) => {
  const [inview, setinview] = React.useState(!observe);
  let lazy = React.useRef();

  React.useEffect(() => {
    if (observe) {
      const observer = new window.IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setinview(true);
          } else {
            setinview(false);
          }
        });
      });
      observer.observe(lazy.current);
    }
  }, []);
  return (
    <div className="img-container" ref={lazy}>
      {inview && <Image src={src} layout="fill" alt={alt} objectFit="cover" {...props}></Image>}
    </div>
  );
};

export default LazyImg;
