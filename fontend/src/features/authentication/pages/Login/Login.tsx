import { useState, type FormEvent } from "react";
import classes from "./Login.module.scss";
import { Box } from "../../components/Box/Box";
import { Input } from "../../../../components/Input/Input";
import { Button } from "../../../../components/Button/Button";
import { Seperator } from "../../components/Seperator/Seperator";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthentication } from "../../contexts/AuthenticationContextProvider";
import { usePageTitle } from "../../../../hooks/usePageTitle";

export function Login() {
    const [errorMessage, setErrorMessage] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuthentication();

    const navigate = useNavigate();

    const location = useLocation();

    usePageTitle("Login");

    const doLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const email = e.currentTarget.email.value;
        const password = e.currentTarget.password.value;
        // console.log(email, password);
        try {
            await login(email, password);
            const destination = location.state?.from || "/";
            navigate(destination);
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={classes.root}>
            <Box>
                <h1>Sign in</h1>
                <p>Stay updated on your professional world.</p>
                <form onSubmit={doLogin}>
                    <Input type="email" id="email" label="Email" onFocus={() => setErrorMessage("")} />
                    <Input type="password" id="password" label="Password" onFocus={() => setErrorMessage("")} />
                    {errorMessage && <p className={classes.error}>{errorMessage}</p>}
                    <Button type="submit" disabled={isLoading}>
                        
                        {
                            isLoading ? "..." : "Sign in"
                        }

                    </Button>
                    <Link to="/authentication/request-password-reset" >Forgot password?</Link>
                </form>
                <Seperator>Or</Seperator>
                <div className={classes.register}>
                    New to LinkedIn? <Link to="/authentication/signup">Join now</Link>
                </div>
            </Box>
        </div>
    );

};