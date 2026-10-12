import React, { useState } from 'react';
import { workoutApi } from '../services/api';

const ALL_WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const FITNESS_GOALS = [
  { id: 'Muscle gain', label: 'Muscle Gain', icon: '💪', desc: 'Hypertrophy focused' },
  { id: 'Fat loss', label: 'Fat Loss', icon: '🔥', desc: 'Caloric burn & density' },
  { id: 'Strength development', label: 'Strength Development', icon: '🏋️', desc: 'Heavy compounds & power' },
  { id: 'Endurance', label: 'Endurance', icon: '🏃', desc: 'High stamina & conditioning' },
  { id: 'General fitness', label: 'General Fitness', icon: '⚡', desc: 'Balanced health & longevity' },
];

const EXPERIENCE_LEVELS = [
  { id: 'Beginner', label: 'Beginner', desc: '0 – 1 year of consistent lifting' },
  { id: 'Intermediate', label: 'Intermediate', desc: '1 – 3 years of structured training' },
  { id: 'Advanced', label: 'Advanced', desc: '3+ years of progressive overload' },
];

const DURATIONS = [
  { value: 30, label: '30 Mins', desc: 'Quick & focused' },
  { value: 45, label: '45 Mins', desc: 'Time-efficient' },
  { value: 60, label: '60 Mins', desc: 'Standard session' },
  { value: 90, label: '90 Mins', desc: 'High volume' },
];

const EQUIPMENTS = [
  { id: 'Full gym', label: 'Full Gym', desc: 'Barbells, racks, cables & machines' },
  { id: 'Dumbbells', label: 'Dumbbells Only', desc: 'Adjustable or fixed dumbbells' },
  { id: 'Resistance bands', label: 'Resistance Bands', desc: 'Loop & tube bands' },
  { id: 'Bodyweight only', label: 'Bodyweight Only', desc: 'Calisthenics, no gear needed' },
  { id: 'Limited or custom equipment', label: 'Custom / Mixed', desc: 'Bands, dumbbells & bars' },
];

const SPLITS = [
  { id: 'Auto', label: 'Automatic Selection', desc: 'Recommended based on frequency' },
  { id: 'Full body', label: 'Full Body', desc: 'High frequency full-body stimulation' },
  { id: 'Upper/lower', label: 'Upper / Lower', desc: 'Balanced upper & lower body days' },
  { id: 'Push/pull/legs', label: 'Push / Pull / Legs', desc: 'Targeted mechanical movement planes' },
];

export default function WorkoutPlanner({ currentUser, onPlanSaved, setActiveTab }) {
  const [formData, setFormData] = useState({
    planTitle: '',
    fitnessGoal: 'Muscle gain',
    experienceLevel: 'Intermediate',
    workoutFrequency: 4,
    preferredDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    workoutDuration: 60,
    equipment: 'Full gym',
    trainingSplit: 'Auto',
    targetMuscleGroups: '',
    exercisesToAvoid: '',
    notes: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Toggle days with validation
  const toggleDay = (day) => {
    let updated;
    if (formData.preferredDays.includes(day)) {
      updated = formData.preferredDays.filter((d) => d !== day);
    } else {
      if (formData.preferredDays.length >= formData.workoutFrequency) {
        setError(`You have already selected ${formData.workoutFrequency} days. Deselect a day first or increase your workout frequency.`);
        return;
      }
      updated = [...formData.preferredDays, day];
    }
    setError('');
    setFormData({ ...formData, preferredDays: updated });
  };

  const handleFrequencyChange = (freq) => {
    setError('');
    let days = [...formData.preferredDays];
    if (freq === 2) days = ['Tuesday', 'Thursday'];
    else if (freq === 3) days = ['Monday', 'Wednesday', 'Friday'];
    else if (freq === 4) days = ['Monday', 'Tuesday', 'Thursday', 'Friday'];
    else if (freq === 5) days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    else if (freq === 6) days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    setFormData({ ...formData, workoutFrequency: freq, preferredDays: days });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setSaveSuccess(false);

    if (formData.preferredDays.length !== formData.workoutFrequency) {
      setError(`Workout frequency is set to ${formData.workoutFrequency} days, but you have selected ${formData.preferredDays.length} day(s). Please select exactly ${formData.workoutFrequency} training days.`);
      return;
    }

    try {
      setIsGenerating(true);
      const plan = await workoutApi.generatePlan(formData);
      setGeneratedPlan(plan);
      setTimeout(() => {
        const previewEl = document.getElementById('generated-plan-preview');
        if (previewEl) previewEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err.message || 'Failed to generate workout plan.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = async () => {
    if (!generatedPlan) return;
    setError('');
    try {
      setIsSaving(true);
      const planToSave = {
        ...generatedPlan,
        userEmail: currentUser?.email || null,
      };
      const saved = await workoutApi.savePlan(planToSave);
      setSaveSuccess(true);
      if (onPlanSaved) {
        onPlanSaved(saved);
      }
    } catch (err) {
      setError(err.message || 'Failed to save workout plan to database.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="badge badge-lime" style={{ marginBottom: '0.65rem' }}>Custom Plan Generator</span>
        <h1 className="section-title">Personalized Workout Planner</h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Select your training preferences below. FitSchedule's backend rules engine will assemble an optimal, progressive weekly plan tailored to your available gear.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ maxWidth: '880px', margin: '0 auto 1.5rem auto' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>{error}</div>
        </div>
      )}

      {saveSuccess && (
        <div className="alert alert-success" style={{ maxWidth: '880px', margin: '0 auto 1.5rem auto' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span>Workout Plan successfully saved to MySQL database!</span>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setActiveTab('my-workouts')}
              style={{ marginLeft: '1rem' }}
            >
              Go to My Workouts &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Generator Form */}
      <form onSubmit={handleGenerate} className="card" style={{ maxWidth: '880px', margin: '0 auto 3rem auto', padding: '2.5rem', backgroundColor: '#ffffff' }}>
        {/* Optional Custom Title */}
        <div className="form-group">
          <label className="form-label">Plan Title (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. 4-Day Hypertrophy & Strength Program"
            value={formData.planTitle}
            onChange={(e) => setFormData({ ...formData, planTitle: e.target.value })}
          />
        </div>

        {/* 1. Fitness Goal */}
        <div className="form-group">
          <label className="form-label">1. Primary Fitness Goal</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.65rem' }}>
            {FITNESS_GOALS.map((g) => {
              const active = formData.fitnessGoal === g.id;
              return (
                <div
                  key={g.id}
                  className={`option-btn ${active ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, fitnessGoal: g.id })}
                  style={{ textAlign: 'left', padding: '0.85rem' }}
                >
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{g.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: active ? '#15803d' : '#0f172a' }}>{g.label}</div>
                  <div style={{ fontSize: '0.75rem', color: active ? '#166534' : 'var(--text-dim)', marginTop: '0.2rem' }}>
                    {g.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Experience Level */}
        <div className="form-group">
          <label className="form-label">2. Experience Level</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
            {EXPERIENCE_LEVELS.map((lvl) => {
              const active = formData.experienceLevel === lvl.id;
              return (
                <div
                  key={lvl.id}
                  className={`option-btn ${active ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, experienceLevel: lvl.id })}
                  style={{ textAlign: 'left', padding: '0.85rem' }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: active ? '#15803d' : '#0f172a' }}>{lvl.label}</div>
                  <div style={{ fontSize: '0.78rem', color: active ? '#166534' : 'var(--text-dim)', marginTop: '0.2rem' }}>
                    {lvl.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Workout Frequency */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>3. Workout Frequency (Days per Week)</label>
            <span className="badge badge-lime">{formData.workoutFrequency} Days / Week</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {[2, 3, 4, 5, 6].map((num) => {
              const active = formData.workoutFrequency === num;
              return (
                <button
                  type="button"
                  key={num}
                  className={`weekday-pill ${active ? 'active' : ''}`}
                  onClick={() => handleFrequencyChange(num)}
                  style={{ flex: 1, padding: '0.75rem 0' }}
                >
                  {num} Days
                </button>
              );
            })}
          </div>

          {/* Preferred Training Days */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Select Training Days</label>
            <span style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: formData.preferredDays.length === formData.workoutFrequency ? '#15803d' : '#d97706',
            }}>
              {formData.preferredDays.length} of {formData.workoutFrequency} days selected
            </span>
          </div>
          <div className="weekday-selector">
            {ALL_WEEKDAYS.map((day) => {
              const active = formData.preferredDays.includes(day);
              return (
                <button
                  type="button"
                  key={day}
                  className={`weekday-pill ${active ? 'active' : ''}`}
                  onClick={() => toggleDay(day)}
                >
                  {day.slice(0, 3)}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Workout Duration */}
        <div className="form-group">
          <label className="form-label">4. Session Duration</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
            {DURATIONS.map((d) => {
              const active = formData.workoutDuration === d.value;
              return (
                <div
                  key={d.value}
                  className={`option-btn ${active ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, workoutDuration: d.value })}
                >
                  <div style={{ fontWeight: 700, color: active ? '#15803d' : '#0f172a' }}>{d.label}</div>
                  <div style={{ fontSize: '0.72rem', color: active ? '#166534' : 'var(--text-dim)', marginTop: '0.15rem' }}>
                    {d.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Available Equipment */}
        <div className="form-group">
          <label className="form-label">5. Available Equipment</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.65rem' }}>
            {EQUIPMENTS.map((eq) => {
              const active = formData.equipment === eq.id;
              return (
                <div
                  key={eq.id}
                  className={`option-btn ${active ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, equipment: eq.id })}
                  style={{ textAlign: 'left', padding: '0.85rem' }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: active ? '#15803d' : '#0f172a' }}>{eq.label}</div>
                  <div style={{ fontSize: '0.76rem', color: active ? '#166534' : 'var(--text-dim)', marginTop: '0.2rem' }}>
                    {eq.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Training Split */}
        <div className="form-group">
          <label className="form-label">6. Preferred Training Split</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.65rem' }}>
            {SPLITS.map((sp) => {
              const active = formData.trainingSplit === sp.id;
              return (
                <div
                  key={sp.id}
                  className={`option-btn ${active ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, trainingSplit: sp.id })}
                  style={{ textAlign: 'left', padding: '0.85rem' }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: active ? '#15803d' : '#0f172a' }}>{sp.label}</div>
                  <div style={{ fontSize: '0.75rem', color: active ? '#166534' : 'var(--text-dim)', marginTop: '0.2rem' }}>
                    {sp.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7. Optional Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Target Muscle Groups (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Chest, Back, Delts"
              value={formData.targetMuscleGroups}
              onChange={(e) => setFormData({ ...formData, targetMuscleGroups: e.target.value })}
            />
            <div className="form-helper">Prioritizes movements for these muscle groups.</div>
          </div>

          <div className="form-group">
            <label className="form-label">Exercises to Avoid (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Deadlift, Bench Press"
              value={formData.exercisesToAvoid}
              onChange={(e) => setFormData({ ...formData, exercisesToAvoid: e.target.value })}
            />
            <div className="form-helper">Filters out exercises matching these names.</div>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isGenerating}
            style={{ width: '100%', maxWidth: '380px' }}
          >
            {isGenerating ? (
              <>
                <span className="spinner"></span>
                Generating Custom Plan...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                Generate Workout Plan
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Plan Interactive Preview */}
      {generatedPlan && (
        <div id="generated-plan-preview" style={{ maxWidth: '960px', margin: '0 auto 4rem auto' }}>
          <div className="card" style={{ borderColor: '#bbf7d0', padding: '2.5rem', backgroundColor: '#ffffff' }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1.25rem',
              marginBottom: '2rem',
              borderBottom: '1px solid var(--border-light)',
              paddingBottom: '1.5rem',
            }}>
              <div>
                <span className="badge badge-lime" style={{ marginBottom: '0.5rem' }}>Generated Routine</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{generatedPlan.title}</h2>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.65rem' }}>
                  <span className="badge badge-cyan">{generatedPlan.fitnessGoal}</span>
                  <span className="badge badge-muted">{generatedPlan.experienceLevel}</span>
                  <span className="badge badge-muted">{generatedPlan.trainingSplit}</span>
                  <span className="badge badge-muted">⏱ {generatedPlan.workoutDuration} min/day</span>
                  <span className="badge badge-muted">🏋️ {generatedPlan.equipment}</span>
                </div>
              </div>

              {/* Save Plan Button */}
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={handleSavePlan}
                disabled={isSaving || saveSuccess}
              >
                {isSaving ? (
                  <>
                    <span className="spinner"></span>
                    Saving to Database...
                  </>
                ) : saveSuccess ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Saved in MySQL!
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Save Workout Plan
                  </>
                )}
              </button>
            </div>

            {/* Plan Days List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {generatedPlan.days.map((day, dIdx) => {
                const isRest = day.isRestDay;
                return (
                  <div
                    key={dIdx}
                    style={{
                      backgroundColor: isRest ? '#f8fafc' : '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      border: isRest ? '1px solid var(--border-light)' : '1px solid #bbf7d0',
                      padding: '1.25rem 1.5rem',
                      boxShadow: isRest ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: isRest ? 'var(--text-muted)' : '#15803d' }}>
                          {day.dayOfWeek}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: '1rem', color: isRest ? 'var(--text-dim)' : '#0f172a' }}>
                          – {day.title}
                        </span>
                      </div>
                      <span className={`badge ${isRest ? 'badge-muted' : 'badge-lime'}`}>
                        {isRest ? 'Rest' : `${day.estimatedDuration} mins`}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: isRest ? '0' : '1rem' }}>
                      Focus: {day.focus}
                    </div>

                    {/* Exercises Table */}
                    {!isRest && day.exercises && day.exercises.length > 0 && (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-medium)', color: '#475569', textAlign: 'left' }}>
                              <th style={{ padding: '0.5rem 0.6rem' }}>#</th>
                              <th style={{ padding: '0.5rem 0.6rem' }}>Exercise</th>
                              <th style={{ padding: '0.5rem 0.6rem' }}>Muscle</th>
                              <th style={{ padding: '0.5rem 0.6rem' }}>Sets</th>
                              <th style={{ padding: '0.5rem 0.6rem' }}>Reps</th>
                              <th style={{ padding: '0.5rem 0.6rem' }}>Rest</th>
                            </tr>
                          </thead>
                          <tbody>
                            {day.exercises.map((ex, eIdx) => (
                              <tr key={eIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '0.65rem 0.6rem', color: '#64748b' }}>{eIdx + 1}</td>
                                <td style={{ padding: '0.65rem 0.6rem', fontWeight: 600, color: '#0f172a' }}>
                                  {ex.exerciseName}
                                  {ex.notes && (
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400, marginTop: '0.15rem' }}>
                                      {ex.notes}
                                    </div>
                                  )}
                                </td>
                                <td style={{ padding: '0.65rem 0.6rem' }}>
                                  <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{ex.muscleGroup}</span>
                                </td>
                                <td style={{ padding: '0.65rem 0.6rem', fontWeight: 700, color: '#15803d' }}>{ex.sets}</td>
                                <td style={{ padding: '0.65rem 0.6rem', color: '#0f172a' }}>{ex.reps}</td>
                                <td style={{ padding: '0.65rem 0.6rem', color: 'var(--text-muted)' }}>{ex.restSeconds}s</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
