import React, { createContext, useState, useEffect } from 'react';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [walletBalance, setWalletBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchWalletBalance = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/wallet`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch wallet balance');
                }
                const data = await response.json();
                setWalletBalance(parseFloat(data.wallet) || 0); // Changed from data.balance to data.wallet
            } catch (error) {
                console.error('Error fetching wallet balance:', error);
            }
        };

        fetchWalletBalance();
    }, []);

    const addFunds = async (amount) => {
        const parsedAmount = parseFloat(amount);
        if (parsedAmount <= 0 || isNaN(parsedAmount)) {
            throw new Error('Invalid amount to add');
        }
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/add-funds`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: parsedAmount }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add funds');
            }
            const data = await response.json();
            setWalletBalance(parseFloat(data.wallet) || 0);
            addTransaction('Deposit', parsedAmount);
        } catch (error) {
            console.error('Error adding funds:', error);
            throw error;
        }
    };

    const withdrawFunds = async (amount) => {
        const parsedAmount = parseFloat(amount);
        if (parsedAmount <= 0 || isNaN(parsedAmount)) {
            throw new Error('Invalid amount to withdraw');
        }
        if (parsedAmount > walletBalance) {
            throw new Error('Insufficient wallet balance');
        }
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/withdraw-funds`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: parsedAmount }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to withdraw funds');
            }
            const data = await response.json();
            setWalletBalance(parseFloat(data.wallet) || 0);
            addTransaction('Withdraw', -parsedAmount);
        } catch (error) {
            console.error('Error withdrawing funds:', error);
            throw error;
        }
    };

    const addTransaction = (type, amount) => {
        const transaction = {
            type,
            date: new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: '2-digit',
                year: 'numeric',
            }),
            amount: `${amount > 0 ? '+' : ''}${parseFloat(amount).toFixed(2)} EGP`,
        };
        setTransactions((prevTransactions) => [transaction, ...prevTransactions]);
    };

    const payWithWallet = (amount) => {
        const parsedAmount = parseFloat(amount);
        if (parsedAmount <= 0 || isNaN(parsedAmount)) {
            throw new Error('Invalid payment amount');
        }
        if (parsedAmount > walletBalance) {
            throw new Error('Insufficient wallet balance for payment');
        }
        setWalletBalance((prevBalance) => {
            const newBalance = prevBalance - parsedAmount;
            return parseFloat(newBalance.toFixed(2));
        });
        addTransaction('Payment', -parsedAmount);
    };

    return (
        <WalletContext.Provider
            value={{
                walletBalance,
                transactions,
                addFunds,
                withdrawFunds,
                payWithWallet,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};
