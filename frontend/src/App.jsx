import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import WorkoutPlanner from './pages/WorkoutPlanner';
import MyWorkouts from './pages/MyWorkouts';
import WorkoutDetails from './pages/WorkoutDetails';
import EditWorkout from './pages/EditWorkout';
import WeeklySchedule from './pages/WeeklySchedule';
import ContactTrainer from './pages/ContactTrainer';
import ExerciseDatabase from './pages/ExerciseDatabase';
import TrainerDashboard from './pages/TrainerDashboard';
import { workoutApi } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // User auth state with localStorage persistence
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fitschedule_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Toast helper
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch plans from backend (filtered by currentUser email if logged in)
  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await workoutApi.getAllPlans(currentUser?.email);
      setPlans(data || []);
      if (data && data.length > 0 && !activePlan) {
        setActivePlan(data[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load workout plans.');
    } finally {
      setLoading(false);
    }
  }, [currentUser, activePlan]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Auth handlers
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('fitschedule_user', JSON.stringify(user));
    addToast(`Welcome back, ${user.fullName}!`, 'success');
    if (user.role === 'TRAINER') {
      setActiveTab('trainer-portal');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fitschedule_user');
    addToast('You have been signed out.', 'info');
    setActiveTab('home');
  };

  // CRUD Handlers
  const handlePlanSaved = (newPlan) => {
    setPlans((prev) => [newPlan, ...prev]);
    setActivePlan(newPlan);
    addToast(`"${newPlan.title}" successfully saved!`, 'success');
  };

  const handleDeletePlan = async (id) => {
    try {
      await workoutApi.deletePlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
      if (activePlan?.id === id) {
        setActivePlan(null);
      }
      addToast('Workout plan deleted successfully from MySQL.', 'info');
    } catch (err) {
      addToast(err.message || 'Failed to delete plan.', 'error');
      throw err;
    }
  };

  const handleUpdateSuccess = (updatedPlan) => {
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setActivePlan(updatedPlan);
    addToast(`"${updatedPlan.title}" updated successfully!`, 'success');
    setActiveTab('workout-details');
  };

  const handleViewDetails = (plan) => {
    setActivePlan(plan);
    setActiveTab('workout-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditPlan = (plan) => {
    setActivePlan(plan);
    setActiveTab('edit-workout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewSchedule = (plan) => {
    if (plan) setActivePlan(plan);
    setActiveTab('schedule');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        planCount={plans.length}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {activeTab === 'home' && (
          <Home
            setActiveTab={setActiveTab}
            onSelectPlan={setActivePlan}
            plans={plans}
          />
        )}

        {activeTab === 'planner' && (
          <WorkoutPlanner
            currentUser={currentUser}
            onPlanSaved={handlePlanSaved}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'my-workouts' && (
          <MyWorkouts
            plans={plans}
            loading={loading}
            error={error}
            onRefresh={fetchPlans}
            onDeletePlan={handleDeletePlan}
            onViewDetails={handleViewDetails}
            onEditPlan={handleEditPlan}
            onViewSchedule={handleViewSchedule}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'workout-details' && (
          <WorkoutDetails
            plan={activePlan}
            onBack={() => setActiveTab('my-workouts')}
            onEdit={handleEditPlan}
            onViewSchedule={handleViewSchedule}
          />
        )}

        {activeTab === 'edit-workout' && (
          <EditWorkout
            plan={activePlan}
            onCancel={() => setActiveTab('workout-details')}
            onSaveSuccess={handleUpdateSuccess}
          />
        )}

        {activeTab === 'schedule' && (
          <WeeklySchedule
            plans={plans}
            activePlan={activePlan}
            onSelectPlan={setActivePlan}
            onEditPlan={handleEditPlan}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'exercises' && (
          <ExerciseDatabase
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'contact' && (
          <ContactTrainer
            currentUser={currentUser}
          />
        )}

        {activeTab === 'trainer-portal' && (
          <TrainerDashboard
            currentUser={currentUser}
          />
        )}
      </main>

      <Footer setActiveTab={setActiveTab} />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
