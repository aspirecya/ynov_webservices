const Loader = () => {
  return (
    <>
      <div className="Loader marge">
        <div className="Loader-stats-container cover center ">
          <div className="step step1">
            <div className="step-container">
              <p className="LoaderText">
                BELIEVE IN THINKING <br></br>DIFFERENTLY
              </p>
              <div className="Loader-percent LoaderSubText">
                <p className="FlexCenter">LOADING</p>
                <span className="FlexCenter">000%</span>
              </div>
            </div>
          </div>

          <div className="step step2">
            <div className="step-container">
              <p className="LoaderText">
                REGIS GRUMBERG<br></br> CREATIVE DEVELOPER
              </p>

              <p className="LoaderSubText"></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loader;
