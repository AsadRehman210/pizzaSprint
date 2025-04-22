// import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Button from "./Button";
const ErrorPage = () => {
  const goBack = () => {
    window.location.href = "/home";
  };
  return (
    <>
      {/* <Helmet>
        <title>error</title>
      </Helmet> */}
      <div className="h-screen overflow-hidden">
        <div className="flex items-stretch justify-center">
          <div className="h-screen overflow-auto flex items-center justify-center py-12 px-6">
            <div className="w-full mx-auto text-center">
              <h1 className="text-2xl mb-5">404 - Page Not Found</h1>
              <Link to="/home">
                <Button
                  btn="primary"
                  onClick={goBack}
                  title="Go back"
                  className="!w-auto px-8 !bg-blue-900 rounded-md"
                />{" "}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
