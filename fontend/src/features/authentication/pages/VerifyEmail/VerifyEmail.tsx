import { useState } from "react";
import { Box } from "../../components/Box/Box";
import { Input } from "../../../../components/Input/Input";
import classes from "./VerifyEmail.module.scss";
import { Button } from "../../../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../../../../hooks/usePageTitle";
import { useAuthentication } from "../../contexts/AuthenticationContextProvider";
import { request } from "../../../../utils/api";

export function VerifyEmail() {
    const [errorMessage, setErrorMessage] = useState("");

    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const { user, setUser } = useAuthentication();

    usePageTitle("Verify Email");

    const validateEmail = async (code: string) => {
        setMessage("");
        await request<void>({
            endpoint: `/api/v1/authentication/validate-email-verification-token?token=${code}`,
            method: "PUT",
            onSuccess: () => {
                setErrorMessage("");
                setUser({ ...user!, emailVerified: true });
                navigate("/");
            },
            onFailure: (error) => {
                setErrorMessage(error);
            },
        });
        setIsLoading(false);
    };

    const sendEmailVerificationToken = async () => {
        setErrorMessage("");
        await request<void>({
            endpoint: `/api/v1/authentication/send-email-verification-token`,
            onSuccess: () => {
                setErrorMessage("");
                setMessage("Code sent successfully. Please check your email.")
            },
            onFailure: (error) => {
                setErrorMessage(error);
            },
        });
        setIsLoading(false);
    };

    return (
        <div className={classes.root} >
            <Box>
                <h1>Verify your email</h1>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setIsLoading(true);
                        const code = e.currentTarget.code.value;
                        await validateEmail(code);
                        setIsLoading(false);
                    }}
                >
                    <p>Only one step left to complete your registration. Verify your email address.</p>
                    <Input type="text" label="Verification code" key="code" name="code"></Input>

                    {message && <p style={{ color: "green" }}>{message}</p>}
                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

                    <Button type="submit" disabled={isLoading}>Validate email</Button>
                    <Button
                        type="button"
                        disabled={isLoading}
                        outline
                        onClick={() => {
                            sendEmailVerificationToken()
                        }}>
                        Send again
                    </Button>
                </form>
            </Box>
        </div >
    );
};