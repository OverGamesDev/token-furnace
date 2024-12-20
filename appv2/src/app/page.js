"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFire } from 'react-icons/fa';
import { useWallet } from '@alephium/web3-react';
import { useLanguage } from './context/LanguageContext';
import { useTheme } from './context/ThemeContext';
import { getContractFactory, convertToInt, getTokenList } from "./services/utils";
import { burn } from "./services/token.service";
import { useBalance } from "@alephium/web3-react";

function BurnInterface() {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();
  const { connectionStatus, account, signer } = useWallet();
  const [selectedToken, setSelectedToken] = useState(null);
  const [burnAmount, setBurnAmount] = useState('');
  const { balance, updateBalanceForTx } = useBalance();
  const [tokenList, setTokenList] = useState([]);
  const [computedBalance, setComputedBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(true);
  const [rawAmount, setRawAmount] = useState();
  const [isCustomToken, setIsCustomToken] = useState(false);

  useEffect(() => {
    document.body.classList.add(theme);
    document.body.classList.add("font-urbanist",);
  }, []);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const tokens = await getTokenList();
        const filteredTokens = tokens.filter(token =>
          balance?.tokenBalances?.some(balanceToken =>
            balanceToken.id === token.id && balanceToken.amount > 0n
          ) ?? false
        );
        setTokenList(filteredTokens);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tokens:", error);
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, [balance]);

  useEffect(() => {
    if (balance?.tokenBalances && selectedToken) {
      const tokenBalance = balance.tokenBalances.find(token => token.id === selectedToken.id);
      if (tokenBalance) {
        const balanceWithDecimals = Number(tokenBalance.amount) / Math.pow(10, selectedToken.decimals);
        setComputedBalance(balanceWithDecimals.toString());
      } else {
        setComputedBalance('0');
      }
    }
  }, [balance, selectedToken]);

  const handlePercentageClick = (percentage) => {
    if (selectedToken && computedBalance) {
      if (percentage === 100) {
        const tokenBalance = balance.tokenBalances.find(token => token.id === selectedToken.id);
        if (tokenBalance) {
          setRawAmount(tokenBalance.amount);
          setBurnAmount(computedBalance);
        }
      } else {
        const amount = (parseFloat(computedBalance) * percentage / 100).toFixed(selectedToken.decimals);
        setBurnAmount(amount);
        setRawAmount(undefined);
      }
    }
  };

  const handleBurn = async () => {
    if (!selectedToken || !burnAmount) return;
    
    try {
      const floatToDecimals = rawAmount ? [rawAmount, 0] : convertToInt(burnAmount);
      const tx = await burn(
        signer,
        BigInt(floatToDecimals[0]),
        Number(floatToDecimals[1]),
        selectedToken?.id ?? '',
        selectedToken?.decimals ?? 0,
        false,
        account?.group,
        rawAmount != undefined? true : false
      );
      
      setRawAmount(undefined);
      updateBalanceForTx(tx.txId, 1);
    } catch (error) {
      console.error("Error during burn:", error);
    }
  };

  const Skeleton = () => (
    <div className={`animate-pulse rounded-lg ${
      isDark ? 'bg-gray-700' : 'bg-gray-200'
    } h-[42px] w-full`} />
  );

  return (
    <div className={`min-h-screen flex flex-col relative transition-colors duration-200`}>
      <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`backdrop-blur-xl rounded-2xl p-6 border transition-colors duration-200 ${
            isDark 
              ? 'bg-gray-800/50 text-white border-gray-700/50' 
              : 'bg-white/50 text-gray-900 border-gray-200/50'
          }`}
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-orange-400/10 rounded-full">
              <FaFire className="text-orange-400 w-8 h-8" />
            </div>
          </div>

          {connectionStatus !== 'connected' ? (
            <div className="text-center space-y-4">
              <p className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('connectWalletMessage') || 'Please connect your wallet to burn tokens'}
              </p>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <select
                      value={isCustomToken ? 'custom' : (selectedToken?.symbol || '')}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setIsCustomToken(true);
                          setSelectedToken(null);
                          setBurnAmount('');
                        } else {
                          setIsCustomToken(false);
                          const token = tokenList.find(t => t.symbol === e.target.value);
                          setSelectedToken(token);
                          setBurnAmount('');
                        }
                      }}
                      className={`w-full p-3 rounded-lg appearance-none transition-colors duration-200 ${
                        isDark
                          ? 'bg-gray-700 text-white border-gray-600'
                          : 'bg-gray-50 text-gray-900 border-gray-200'
                      } border focus:ring-2 focus:ring-orange-400 focus:border-transparent`}
                    >
                      <option value="">{t('select')}...</option>
                      <option value="custom">Custom Token</option>
                      {tokenList.map((token) => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.symbol}
                        </option>
                      ))}
                    </select>
                  </div>

                  {isCustomToken && (
                    <div className={`space-y-2 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <p className="text-sm">Enter custom token ID:</p>
                      <input
                        type="text"
                        placeholder="Token ID"
                        onChange={(e) => {
                          setSelectedToken({
                            id: e.target.value,
                            symbol: 'Custom Token',
                            decimals: 0,
                            name: 'Custom Token',
                            description: 'Custom Token',
                            logoURI: ''
                          });
                        }}
                        className={`w-full p-3 rounded-lg transition-colors duration-200 ${
                          isDark
                            ? 'bg-gray-700 text-white border-gray-600'
                            : 'bg-gray-50 text-gray-900 border-gray-200'
                        } border focus:ring-2 focus:ring-orange-400 focus:border-transparent`}
                      />
                    </div>
                  )}

                  {selectedToken && (
                    <div className="text-center mb-4">
                      <p className={`transition-colors duration-200 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {t('availableBalance')}: {computedBalance} {selectedToken.symbol}
                      </p>
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type="number"
                      value={burnAmount}
                      onChange={(e) => setBurnAmount(e.target.value)}
                      placeholder="0.00"
                      className={`w-full p-3 rounded-lg transition-colors duration-200 ${
                        isDark
                          ? 'bg-gray-700 text-white border-gray-600'
                          : 'bg-gray-50 text-gray-900 border-gray-200'
                      } border focus:ring-2 focus:ring-orange-400 focus:border-transparent text-center`}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                      {[10, 50, 100].map((percentage) => (
                        <button
                          key={percentage}
                          onClick={() => handlePercentageClick(percentage)}
                          className={`text-xs px-2 py-1 rounded transition-colors duration-200 ${
                            isDark
                              ? 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                        >
                          {percentage === 100 ? 'Max' : `${percentage}%`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBurn}
                    disabled={!selectedToken || !burnAmount}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                      !selectedToken || !burnAmount
                        ? isDark 
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : isDark
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-orange-400 hover:bg-orange-500 text-white'
                    }`}
                  >
                    {t('burn')}
                  </motion.button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default BurnInterface;
