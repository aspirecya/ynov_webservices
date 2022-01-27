import "../styles/index.scss";
import dynamic from 'next/dynamic'
import React from "react";
import { useRouter } from "next/router";
import Controller from "@classes/Controller/Controller";
import Nav from "@components/Nav/Nav";


const Head = dynamic(() => import("next/head"));


function MyApp({ Component, pageProps, props }) {
  const [controller, setcontroller] = React.useState();
  let router = useRouter();

  React.useEffect(() => {
    let x = new Controller(router);
    setcontroller(x);
  }, []);
  React.useEffect(() => {
    if (controller) {
      controller.Routing.NextupdateRouter(router);
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>RegisGrumberg</title>
        <meta
          name="viewport"
          content="user-scalable=0, width=device-width, initial-scale=1.0, maximum-scale=5.0"
        ></meta>
        <meta
          name="description"
          content="Author: Regis Grumberg,
    Creative developer:Home Page Portfolio categories projects"
        ></meta>
      </Head>
    <Nav></Nav>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
