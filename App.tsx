import React, { useState, useEffect } from 'react';
import { PlusCircle, TrendingUp, Award, XCircle, BarChart3 } from 'lucide-react';
import { Bet, BetStatus } from './types';
import { Header } from './components/Header';
import BetForm from './components/BetForm';
import BetList from './components/BetList';

export default function App() {
  const [balance, setBalance] = useState(7.96);
  const [bets, setBets] = useState<Bet[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const savedBets = localStorage.getItem('bets');
    const savedBalance = localStorage.getItem('balance');
    if (savedBets) setBets(JSON.parse(savedBets));
    if (savedBalance) setBalance(parseFloat(savedBalance));
  }, []);

  useEffect(() => {
    localStorage.setItem('bets', JSON.stringify(bets));
    localStorage.setItem('balance', balance.toString());
  }, [bets, balance]);

  const addBet = (bet: Bet) => {
    setBets([...bets, bet]);
    setShowForm(false);
  };

  const updateBet = (updatedBet: Bet) => {
    setBets(bets.map(bet => (bet.id === updatedBet.id ? updatedBet : bet)));
  };

  const updateBetStatus = (id: string, status: BetStatus) => {
    setBets(bets.map(bet => {
      if (bet.id === id) {
        if (status === 'won') {
          setBalance(prev => prev + bet.possibleWin - bet.amount);
        } else if (status === 'lost') {
          setBalance(prev => prev - bet.amount);
        }
        return { ...bet, status };
      }
      return bet;
    }));
  };

  const deleteBet = (id: string) => {
    const bet = bets.find(b => b.id === id);
    if (bet && bet.status !== 'pending') {
      if (bet.status === 'won') {
        setBalance(prev => prev - (bet.possibleWin - bet.amount));
      } else if (bet.status === 'lost') {
        setBalance(prev => prev + bet.amount);
      }
    }
    setBets(bets.filter(bet => bet.id !== id));
  };

  const stats = {
    totalBets: bets.length,
    wonBets: bets.filter(bet => bet.status === 'won').length,
    lostBets: bets.filter(bet => bet.status === 'lost').length,
    profit: bets.reduce((acc, bet) => {
      if (bet.status === 'won') return acc + (bet.possibleWin - bet.amount);
      if (bet.status === 'lost') return acc - bet.amount;
      return acc;
    }, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header balance={balance} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-500">Total Apuestas</h3>
                </div>
                <span className="text-2xl font-bold">{stats.totalBets}</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-500">Ganadas</h3>
                </div>
                <span className="text-2xl font-bold">{stats.wonBets}</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-500">Perdidas</h3>
                </div>
                <span className="text-2xl font-bold">{stats.lostBets}</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-500">Beneficio</h3>
                </div>
                <span className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  €{stats.profit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Mis Apuestas</h2>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Nueva Apuesta
          </button>
        </div>

        {showForm && (
          <BetForm onSubmit={addBet} onCancel={() => setShowForm(false)} />
        )}

        <BetList
          bets={bets}
          onUpdateStatus={updateBetStatus}
          onDelete={deleteBet}
          onUpdateBet={updateBet}
        />
      </main>
    </div>
  );
}