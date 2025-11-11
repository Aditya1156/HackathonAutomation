import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllTeams, updateTeam, deleteTeam } from '../services/firebaseTeamService';
import type { Team } from '../types';
import { EyeIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon, PencilIcon, XIcon, CheckBadgeIcon, KeyIcon, ClipboardCopyIcon, ExclamationIcon } from '../components/IconComponents';
import { staggerContainer, modalBackdropVariants, modalContentVariants } from '../animations/framerVariants';
import { useToast } from '../hooks/useToast';
import { GlowButton } from '../components/AnimatedComponents';

const tracks = ['AI / Machine Learning', 'Web 3.0 & Blockchain', 'FinTech', 'HealthTech', 'Sustainability & Green Tech'];

// Helper to get initials and a color for team avatars
const getAvatar = (name: string) => {
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const colors = ['bg-fuchsia-600', 'bg-cyan-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-600', 'bg-rose-500'];
    const color = colors[name.length % colors.length];
    return { initials, color };
}

const getStatusColor = (status: Team['status']) => {
    switch (status) {
        case 'Verified': return 'text-green-300 bg-green-500/10 border-green-400/50';
        case 'Checked-in': return 'text-cyan-300 bg-cyan-500/10 border-cyan-400/50';
        case 'Registered':
        default: return 'text-yellow-300 bg-yellow-500/10 border-yellow-400/50';
    }
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const SkeletonTableRow: React.FC = () => (
    <tr className="border-b border-purple-800/40">
        <td className="p-4">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 animate-skeleton-pulse"></div>
                <div className="h-5 w-32 rounded bg-slate-700 animate-skeleton-pulse"></div>
            </div>
        </td>
        <td className="p-4"><div className="h-5 w-24 rounded bg-slate-700 animate-skeleton-pulse"></div></td>
        <td className="p-4"><div className="h-6 w-24 rounded-full bg-slate-700 animate-skeleton-pulse"></div></td>
        <td className="p-4 text-center">
            <div className="flex justify-center">
                <div className="h-6 w-11 rounded-full bg-slate-700 animate-skeleton-pulse"></div>
            </div>
        </td>
        <td className="p-4"><div className="h-5 w-24 rounded bg-slate-700 animate-skeleton-pulse"></div></td>
        <td className="p-4">
            <div className="flex justify-end space-x-1">
                <div className="h-8 w-8 rounded-full bg-slate-700 animate-skeleton-pulse"></div>
                <div className="h-8 w-8 rounded-full bg-slate-700 animate-skeleton-pulse"></div>
            </div>
        </td>
    </tr>
);

const EditTeamModal: React.FC<{ team: Team, onSave: (updatedTeam: Team) => void, onCancel: () => void }> = ({ team, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Team>(team);

    const handleChange = (field: keyof Team, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    
    const handleLeaderChange = (field: keyof Team['leader'], value: string) => {
        setFormData(prev => ({
            ...prev,
            leader: {
                ...prev.leader,
                [field]: value
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
            variants={modalBackdropVariants} initial="hidden" animate="visible" exit="hidden"
            onClick={onCancel}
        >
            <motion.div
                variants={modalContentVariants}
                className="relative bg-[#100D1C] w-full max-w-lg p-8 rounded-xl border border-purple-500/50"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-white">Edit Team: {team.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="teamName" className="block text-sm font-medium text-slate-300">Team Name</label>
                        <input id="teamName" value={formData.name} onChange={e => handleChange('name', e.target.value)} className="w-full mt-1 p-2 bg-slate-800 border rounded-lg border-purple-500/30 focus:ring-2 focus:ring-cyan-500" />
                    </div>
                     <div>
                        <label htmlFor="track" className="block text-sm font-medium text-slate-300">Track</label>
                        <select id="track" value={formData.track} onChange={e => handleChange('track', e.target.value)} className="w-full mt-1 p-2 bg-slate-800 border rounded-lg border-purple-500/30 focus:ring-2 focus:ring-cyan-500">
                            {tracks.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="leaderName" className="block text-sm font-medium text-slate-300">Leader Name</label>
                        <input id="leaderName" value={formData.leader.name} onChange={e => handleLeaderChange('name', e.target.value)} className="w-full mt-1 p-2 bg-slate-800 border rounded-lg border-purple-500/30 focus:ring-2 focus:ring-cyan-500" />
                    </div>
                     <div>
                        <label htmlFor="leaderEmail" className="block text-sm font-medium text-slate-300">Leader Email</label>
                        <input type="email" id="leaderEmail" value={formData.leader.email} onChange={e => handleLeaderChange('email', e.target.value)} className="w-full mt-1 p-2 bg-slate-800 border rounded-lg border-purple-500/30 focus:ring-2 focus:ring-cyan-500" />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-600 rounded-lg hover:bg-slate-700 transition-colors">Cancel</button>
                        <GlowButton onClick={() => {}}>Save Changes</GlowButton>
                    </div>
                </form>
                <button onClick={onCancel} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"><XIcon className="w-6 h-6"/></button>
            </motion.div>
        </motion.div>
    );
};

const CredentialsModal: React.FC<{ team: Team, onClose: () => void }> = ({ team, onClose }) => {
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const addToast = useToast();

    const handleCopy = (text: string, fieldName: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(fieldName);
            addToast(`${fieldName} copied to clipboard!`, 'success');
            setTimeout(() => setCopiedField(null), 2000);
        }).catch(() => {
            addToast('Failed to copy to clipboard', 'error');
        });
    };

    return (
        <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
            variants={modalBackdropVariants} initial="hidden" animate="visible" exit="hidden"
            onClick={onClose}
        >
            <motion.div
                variants={modalContentVariants}
                className="relative bg-[#100D1C] w-full max-w-md p-8 rounded-xl border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-cyan-500/20 p-3 rounded-full">
                        <KeyIcon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white font-orbitron">Team Credentials</h2>
                        <p className="text-slate-400 text-sm">{team.name}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Team ID */}
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/30">
                        <label className="text-xs text-slate-400 uppercase font-semibold mb-2 block">Team ID</label>
                        <div className="flex items-center justify-between">
                            <code className="text-cyan-400 font-mono text-lg font-semibold">{team.id}</code>
                            <button
                                onClick={() => handleCopy(team.id, 'Team ID')}
                                className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors group"
                                title="Copy Team ID"
                            >
                                {copiedField === 'Team ID' ? (
                                    <CheckBadgeIcon className="w-5 h-5 text-green-400" />
                                ) : (
                                    <ClipboardCopyIcon className="w-5 h-5 text-slate-400 group-hover:text-cyan-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/30">
                        <label className="text-xs text-slate-400 uppercase font-semibold mb-2 block">Password</label>
                        <div className="flex items-center justify-between">
                            <code className="text-purple-400 font-mono text-lg font-semibold">{team.password}</code>
                            <button
                                onClick={() => handleCopy(team.password, 'Password')}
                                className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors group"
                                title="Copy Password"
                            >
                                {copiedField === 'Password' ? (
                                    <CheckBadgeIcon className="w-5 h-5 text-green-400" />
                                ) : (
                                    <ClipboardCopyIcon className="w-5 h-5 text-slate-400 group-hover:text-purple-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Team Info */}
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/30">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-slate-500 text-xs uppercase font-semibold mb-1">Leader</p>
                                <p className="text-white">{team.leader.name}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs uppercase font-semibold mb-1">Email</p>
                                <p className="text-white truncate" title={team.leader.email}>{team.leader.email}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs uppercase font-semibold mb-1">Contact</p>
                                <p className="text-white">{team.leader.contactNumber}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs uppercase font-semibold mb-1">Track</p>
                                <p className="text-white truncate" title={team.track}>{team.track}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <p className="text-amber-400 text-xs flex items-start">
                        <ExclamationIcon className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Keep these credentials secure. Share only with the team leader if they forget their login details.</span>
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                >
                    Close
                </button>

                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white">
                    <XIcon className="w-6 h-6"/>
                </button>
            </motion.div>
        </motion.div>
    );
};

const StatusUpdater: React.FC<{ team: Team, onStatusChange: (teamId: string, status: Team['status']) => void }> = ({ team, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const statuses: Team['status'][] = ['Registered', 'Checked-in', 'Verified'];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (status: Team['status']) => {
        onStatusChange(team.id, status);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center justify-center min-w-[100px] transition-transform hover:scale-105 ${getStatusColor(team.status)}`}
            >
                {team.status}
                <ChevronDownIcon className={`w-3 h-3 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-32 mt-1 bg-slate-800 border border-purple-500/50 rounded-lg shadow-xl overflow-hidden"
                    >
                        {statuses.map(status => (
                            <button
                                key={status}
                                onClick={() => handleSelect(status)}
                                className="w-full text-left px-3 py-2 text-sm text-white hover:bg-purple-500/20 transition-colors"
                            >
                                {status}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


type SortKey = 'name' | 'leaderName' | 'registeredAt' | 'status' | 'isVerified';
type SortDirection = 'asc' | 'dsc';

const TeamsPage: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>({ key: 'registeredAt', direction: 'dsc' });
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);
    const [viewingCredentials, setViewingCredentials] = useState<Team | null>(null);
    const addToast = useToast();

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setIsLoading(true);
                const fetchedTeams = await getAllTeams();
                setTeams(fetchedTeams);
            } catch (error) {
                console.error('Error fetching teams:', error);
                addToast('Failed to load teams', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeams();
    }, []);
    
    const handleStatusChange = async (teamId: string, status: Team['status']) => {
        try {
            await updateTeam(teamId, { status });
            setTeams(prevTeams => prevTeams.map(t => t.id === teamId ? { ...t, status } : t));
            addToast(`Status updated to "${status}"`, 'info');
        } catch (error) {
            console.error('Error updating status:', error);
            addToast('Failed to update status', 'error');
        }
    };
    
    const handleVerificationChange = async (teamId: string, isVerified: boolean) => {
        try {
            await updateTeam(teamId, { isVerified });
            setTeams(prevTeams => prevTeams.map(t => t.id === teamId ? { ...t, isVerified } : t));
            addToast(`Verification status changed`, 'info');
        } catch (error) {
            console.error('Error updating verification:', error);
            addToast('Failed to update verification', 'error');
        }
    };
    
    const handleSaveEdit = async (updatedTeam: Team) => {
        try {
            await updateTeam(updatedTeam.id, updatedTeam);
            setTeams(prevTeams => prevTeams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
            setEditingTeam(null);
            addToast(`Team "${updatedTeam.name}" updated successfully!`, 'success');
        } catch (error) {
            console.error('Error updating team:', error);
            addToast('Failed to update team', 'error');
        }
    };

    const requestSort = (key: SortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'dsc';
        }
        setSortConfig({ key, direction });
    };

    const sortedAndFilteredTeams = useMemo(() => {
        let processableTeams = [...teams];

        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            processableTeams = processableTeams.filter(team =>
                team.name.toLowerCase().includes(lowercasedQuery) ||
                team.leader.name.toLowerCase().includes(lowercasedQuery)
            );
        }

        if (sortConfig !== null) {
            processableTeams.sort((a, b) => {
                let aValue: string | number | boolean;
                let bValue: string | number | boolean;

                switch (sortConfig.key) {
                    case 'leaderName': aValue = a.leader.name; bValue = b.leader.name; break;
                    case 'registeredAt': aValue = new Date(a.registeredAt).getTime(); bValue = new Date(b.registeredAt).getTime(); break;
                    case 'status': aValue = a.status; bValue = b.status; break;
                    case 'isVerified': aValue = a.isVerified; bValue = b.isVerified; break;
                    case 'name': default: aValue = a.name; bValue = b.name; break;
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return processableTeams;
    }, [searchQuery, sortConfig, teams]);
    
    const SortableHeader: React.FC<{ sortKey: SortKey, children: React.ReactNode, className?: string }> = ({ sortKey, children, className }) => {
        const isSorted = sortConfig?.key === sortKey;
        const Icon = sortConfig?.direction === 'asc' ? ChevronUpIcon : ChevronDownIcon;
        return (
            <th className={`p-4 font-semibold whitespace-nowrap ${className}`}>
                <button onClick={() => requestSort(sortKey)} className="flex items-center space-x-1 hover:text-cyan-400 transition-colors">
                    <span>{children}</span>
                    {isSorted && <Icon className="w-4 h-4" />}
                </button>
            </th>
        );
    };

  return (
    <>
      <AnimatePresence>
        {editingTeam && <EditTeamModal team={editingTeam} onSave={handleSaveEdit} onCancel={() => setEditingTeam(null)} />}
        {viewingCredentials && <CredentialsModal team={viewingCredentials} onClose={() => setViewingCredentials(null)} />}
      </AnimatePresence>

      <h1 className="text-4xl font-bold mb-4">Registered Teams</h1>
      <p className="text-slate-400 mb-8">Manage and view all team registrations. Sort by clicking on column headers.</p>

      <div className="mb-6">
        <input
            type="text"
            placeholder="Search by team or leader name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-lg p-3 bg-slate-900/50 border border-purple-800/60 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
        />
      </div>

      <div className="bg-[#100D1C]/50 border border-purple-800/60 rounded-xl overflow-x-auto shadow-2xl backdrop-blur-sm">
        <table className="w-full text-left">
          <thead className="border-b border-purple-800/60">
            <tr>
              <SortableHeader sortKey="name">Team Name</SortableHeader>
              <SortableHeader sortKey="leaderName">Leader</SortableHeader>
              <SortableHeader sortKey="status">Status</SortableHeader>
              <SortableHeader sortKey="isVerified" className="text-center">Verified</SortableHeader>
              <SortableHeader sortKey="registeredAt">Registered On</SortableHeader>
              <th className="p-4 font-semibold whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
           {isLoading ? (
                <tbody>
                    {[...Array(5)].map((_, i) => <SkeletonTableRow key={i} />)}
                </tbody>
           ) : (
              <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
                {sortedAndFilteredTeams.length > 0 ? (
                    sortedAndFilteredTeams.map((team: Team) => {
                        const avatar = getAvatar(team.name);
                        return (
                          <motion.tr
                            key={team.id}
                            variants={rowVariants}
                            whileHover={{ backgroundColor: 'rgba(126, 34, 206, 0.2)' }}
                            className="border-b border-purple-800/40 last:border-b-0"
                          >
                            <td className="p-4 font-medium">
                                <div className="flex items-center space-x-3">
                                    {team.teamLogoUrl ? (
                                        <img src={team.teamLogoUrl} alt={team.name} className="w-10 h-10 rounded-full object-cover bg-slate-700" />
                                    ) : (
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${avatar.color}`}>
                                            {avatar.initials}
                                        </div>
                                    )}
                                    <span>{team.name}</span>
                                </div>
                            </td>
                            <td className="p-4 text-slate-300">{team.leader.name}</td>
                            <td className="p-4"><StatusUpdater team={team} onStatusChange={handleStatusChange} /></td>
                            <td className="p-4 text-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" checked={team.isVerified} onChange={(e) => handleVerificationChange(team.id, e.target.checked)} className="sr-only peer" />
                                  <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                  {team.isVerified && <CheckBadgeIcon className="w-5 h-5 text-green-400 absolute -right-6 top-0.5" />}
                                </label>
                            </td>
                            <td className="p-4 text-slate-400 text-sm">
                                {new Date(team.registeredAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex justify-end space-x-1">
                                    <button 
                                        onClick={() => setViewingCredentials(team)} 
                                        className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-cyan-400 transition-colors" 
                                        aria-label="View Credentials"
                                        title="View Team Credentials"
                                    >
                                        <KeyIcon className="w-5 h-5"/>
                                    </button>
                                    <button onClick={() => setEditingTeam(team)} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-purple-400 transition-colors" aria-label="Edit Team"><PencilIcon className="w-5 h-5"/></button>
                                    <button className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-rose-400 transition-colors" aria-label="Delete Team"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                            </td>
                          </motion.tr>
                        )
                    })
                ) : (
                    <tr>
                        <td colSpan={7} className="text-center p-8 text-slate-400">
                            No teams found matching your criteria.
                        </td>
                    </tr>
                )}
              </motion.tbody>
           )}
        </table>
      </div>
    </>
  );
};

export default TeamsPage;