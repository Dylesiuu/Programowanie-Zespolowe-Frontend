import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "../components/LoginForm";
import { useRouter } from "next/router";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

jest.mock("next/router", () => ({
    useRouter: jest.fn(),
}));

describe("LoginForm", () => {
    let mockPush;

    beforeEach(() => {
        mockPush = jest.fn();
        useRouter.mockImplementation(() => ({
            push: mockPush,
            replace: mockPush,
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders the login form", () => {
       render(<LoginForm />);

       expect(screen.getByText("Zaloguj się!")).toBeInTheDocument();
       expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
       expect(screen.getByPlaceholderText("Hasło")).toBeInTheDocument();
       expect(screen.getByRole("button", {name: "Zaloguj się"})).toBeInTheDocument();
    });

    it("shows an error message when required fields are empty", async() => {
        render(<LoginForm />);

        await userEvent.click(screen.getByRole("button", {name: "Zaloguj się"}));

        await waitFor(() => {
            expect(screen.getByText("Email jest wymagany.")).toBeInTheDocument();
            expect(screen.getByText("Hasło jest wymagane.")).toBeInTheDocument();
        });
    });

    it("shows an error message when login credencials are invalid", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 401,
            })
        );

        render(<LoginForm />);

        await userEvent.type(screen.getByPlaceholderText("Email"), "wrong@example.com");
        await userEvent.type(screen.getByPlaceholderText("Hasło"), "wrongpassword");
        await userEvent.click(screen.getByRole("button", {name : "Zaloguj się"}));

        await waitFor( () => {
            expect(screen.getByText("Złe dane logowania.")).toBeInTheDocument();
            expect(global.fetch).toHaveBeenCalledWith(
                `${API_BASE_URL}/auth/login`,
                expect.objectContaining({
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: "wrong@example.com",
                        password: "wrongpassword",
                    })
                })
            )
        })
    });

    it("shows an error message when email format is invalid", async () => {
        render(<LoginForm />);

        await userEvent.type(screen.getByPlaceholderText("Email"), "invalid-email");
        await userEvent.click(screen.getByRole("button", { name : "Zaloguj się" }));

        await waitFor(() => {
            expect(screen.getByText("Nieprawidłowy format adresu e-mail.")).toBeInTheDocument();
        })
    });

    it("redirects to swipePage when login is successful", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
            })
        );
        render(<LoginForm />);

        await userEvent.type(screen.getByPlaceholderText("Email"), "john.doe@example.com");
        await userEvent.type(screen.getByPlaceholderText("Hasło"), "StrongPassword123!");
        await userEvent.click(screen.getByRole("button", { name: "Zaloguj się" }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `${API_BASE_URL}/auth/login`,
                expect.objectContaining({
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: "john.doe@example.com",
                        password: "StrongPassword123!",
                    }),
                })
            );

            expect(mockPush).toHaveBeenCalledWith("/swipePage");
        });
    });

});



