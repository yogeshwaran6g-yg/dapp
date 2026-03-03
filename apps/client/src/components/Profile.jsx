import React, { useState, useEffect } from 'react';
import { useGetProfile, useUpdateProfile } from '../hooks/useProfile';
import PageHeading from './PageHeading';

const Profile = () => {
    let userId = null;
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined') {
            userId = JSON.parse(storedUser)?.id;
        }
    } catch (e) {
        console.error('Error parsing user from localStorage', e);
    }

    const { data: queryData, isLoading, isError, error } = useGetProfile(userId);
    const { mutate: saveProfile, isPending: isSaving } = useUpdateProfile(userId);

    const [profile, setProfile] = useState({
        username: '',
        email: '',
        phone_number: '',
        dob: '',
        city: '',
        country: '',
        wallet_address: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    // Sync local edit buffer when remote data arrives
    useEffect(() => {
        if (queryData?.data) {
            const remote = { ...queryData.data };
            if (remote.dob) {
                remote.dob = new Date(remote.dob).toISOString().split('T')[0];
            }
            setProfile(remote);
        }
    }, [queryData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        saveProfile(profile, {
            onSuccess: () => setIsEditing(false),
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-primary">
                <div className="relative">
                    <div className="w-20 h-20 border-2 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 border-2 border-accent-gold/10 border-b-accent-gold rounded-full animate-spin-reverse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !userId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-primary text-white p-4">
                <div className="glass-panel p-8 rounded-3xl border border-red-500/30 text-center max-w-md">
                    <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
                    <h2 className="text-2xl font-bold mb-2">Profile Error</h2>
                    <p className="text-gray-400 mb-6">{!userId ? 'Please login to view your profile' : (error?.message || 'Failed to load profile data')}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 rounded-xl bg-accent-gold text-primary font-bold"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!queryData?.data && !isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-primary text-white">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-accent-gold/40 mb-4">person_off</span>
                    <h2 className="text-2xl font-bold">Profile Not Found</h2>
                    <p className="text-gray-400 mt-2">We couldn't find your profile details.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark text-white relative overflow-hidden pb-20">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-accent-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-accent-gold/5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 pt-2 sm:pt-4 md:pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4 mb-4 sm:mb-6 md:mb-8 w-full">
                    <PageHeading
                        highlight="PERSONAL"
                        title="PROFILE"
                        subtitle="Manage your digital identity and account settings"
                    />

                    <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 sm:gap-4">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="group flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-2xl glass-panel border border-accent-gold/30 text-accent-gold hover:bg-accent-gold/10 transition-all duration-300 font-bold shadow-lg shadow-accent-gold/5 w-full sm:w-auto text-sm sm:text-base"
                            >
                                <span className="material-symbols-outlined text-xl transition-transform group-hover:rotate-12">edit</span>
                                Edit Account
                            </button>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-2xl glass-panel border border-white/10 text-gray-400 hover:bg-white/5 transition-all duration-300 font-bold order-2 sm:order-1 text-sm sm:text-base"
                                >
                                    Discard
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-2xl action-gradient-gold text-primary font-bold shadow-xl shadow-accent-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 order-1 sm:order-2 text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 lg:items-start">
                    {/* Left Column: Avatar & Summary */}
                    <div className="lg:col-span-4 space-y-4 sm:space-y-6">
                        <div className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 md:p-8 flex flex-col items-center border border-white/10 relative overflow-hidden group shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            {/* Profile Image with Ring Animation */}
                            <div className="relative">
                                <div className="absolute inset-[-6px] sm:inset-[-8px] border border-accent-gold/20 rounded-[2.2rem] sm:rounded-[2.5rem] animate-pulse"></div>
                                <div className="w-28 h-28 sm:w-40 md:w-48 sm:h-40 md:h-48 rounded-[1.8rem] sm:rounded-[2rem] overflow-hidden border-2 border-accent-gold/30 shadow-2xl relative z-10 transition-all duration-500">
                                    <img
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFKaOGEqx67axoW6iLXhSdvdyvxDb170U5VryWHnElt8B3QKCoot9mI3RUcatVZuM5rltR8cmExLDnrl_qsNwJBKSWJ6IESqKE7jtV5trks0gBD0ikRyggNLDZju4NL_dHT_qL4IKZl2YkK5nhwjM81QMVMHF5cs_4VGOBa2KfROplMXKA7hoh0uPc5xu1YaEdSa9r7MrlepExGa4G1dGmzZ3j6X_251LoiCgf46PRS98ilHdr2GxmH1QaHqcYhB-sHIbLdRdoAjrj"
                                        alt="User profile"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {isEditing && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer group/upload">
                                            <div className="bg-accent-gold p-3 rounded-full text-primary transform scale-75 group-hover/upload:scale-100 transition-transform duration-300">
                                                <span className="material-symbols-outlined text-2xl">photo_camera</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mt-4 sm:mt-6 text-white tracking-tight">{profile.username || 'Unset Username'}</h2>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-2 h-2 bg-accent-gold rounded-full animate-ping"></span>
                                <p className="text-sm text-accent-gold font-black uppercase tracking-[0.2em]">Verified Member</p>
                            </div>

                            <div className="mt-10 w-full space-y-6 pt-8 border-t border-white/5">
                                <div className="grid grid-cols-1 gap-6">
                                    <ProfileItem
                                        label="City"
                                        name="city"
                                        value={profile.city}
                                        isEditing={isEditing}
                                        onChange={handleChange}
                                        icon="location_on"
                                    />
                                    <ProfileItem
                                        label="Country"
                                        name="country"
                                        value={profile.country}
                                        isEditing={isEditing}
                                        onChange={handleChange}
                                        icon="public"
                                    />
                                </div>
                                <div className="space-y-3 pt-6 border-t border-white/5">
                                    <div className="flex items-center justify-between text-[11px] text-gray-500 uppercase font-black tracking-widest">
                                        <span>Wallet Address</span>
                                        <span className="text-accent-gold/60">Encrypted</span>
                                    </div>
                                    <div className="flex items-center justify-between bg-white/5 p-3 sm:p-4 rounded-2xl border border-white/10 group/wallet transition-colors hover:border-accent-gold/30 w-full overflow-hidden">
                                        <span className="text-[10px] sm:text-xs font-mono text-gray-300 truncate mr-2 block">
                                            {profile.wallet_address || '0x0000...0000'}
                                        </span>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(profile.wallet_address);
                                                // Optional: add a tooltip or message
                                            }}
                                            className="material-symbols-outlined text-lg sm:text-xl text-accent-gold/50 hover:text-accent-gold transition-colors flex-shrink-0 active:scale-90"
                                        >
                                            content_copy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Detailed Forms */}
                    <div className="lg:col-span-8">
                        <div className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden h-full">
                            <div className="absolute top-0 right-0 w-60 h-60 sm:w-80 sm:h-80 bg-accent-gold/5 blur-[80px] sm:blur-[100px] -mr-30 sm:-mr-40 -mt-30 sm:-mt-40 pointer-events-none"></div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 lg:gap-x-10 gap-y-6 lg:gap-y-8">
                                <ProfileItem
                                    label="Username"
                                    name="username"
                                    value={profile.username}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                    icon="person"
                                />
                                <ProfileItem
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={profile.email}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                    icon="mail"
                                />
                                <ProfileItem
                                    label="Phone Number"
                                    name="phone_number"
                                    value={profile.phone_number}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                    icon="call"
                                />
                                <ProfileItem
                                    label="Date of Birth"
                                    name="dob"
                                    type="date"
                                    value={profile.dob}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                    icon="cake"
                                />
                                <div className="sm:col-span-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {/* Row for City and Country if preferred, but keeping standard layout */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileItem = ({ label, name, value, isEditing, onChange, type = "text", icon }) => (
    <div className="space-y-3 group/item">
        <label className="text-xs text-gray-500 uppercase font-black tracking-[0.15em] ml-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-accent-gold/60">{icon}</span>
            {label}
        </label>
        {isEditing ? (
            <div className="relative">
                <input
                    type={type}
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-white focus:border-accent-gold/50 focus:ring-4 focus:ring-accent-gold/5 outline-none transition-all duration-300 placeholder:text-gray-600 [color-scheme:dark]"
                />
            </div>
        ) : (
            <div className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 sm:px-6 py-3 sm:py-4 text-gray-200 min-h-[50px] sm:min-h-[58px] flex items-center shadow-inner group-hover/item:border-white/20 transition-colors overflow-hidden">
                <span className="font-medium text-base sm:text-lg break-words w-full">{value || 'Not provided'}</span>
            </div>
        )}
    </div>
);

export default Profile;
