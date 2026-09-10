// src/components/EmailNotificationViewer.jsx
import React, { useState, useEffect } from 'react';
import { Mail, Key, Trash2, X, Check, Copy, RefreshCw, Send, Search, ExternalLink, ShieldCheck } from 'lucide-react';
import { getEmailLogs, clearEmailLogs, sendTestEmail } from '../utils/emailService';

export default function EmailNotificationViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState(() => getEmailLogs());
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'otp', 'orders', 'test'
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Test Email form state
  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox' | 'test'
  const [testEmailInput, setTestEmailInput] = useState('');
  const [testSubjectInput, setTestSubjectInput] = useState('');
  const [testMessageInput, setTestMessageInput] = useState('');
  const [testStatus, setTestStatus] = useState('');
  const [testLoading, setTestLoading] = useState(false);

  const refreshLogs = () => {
    const updated = getEmailLogs();
    setLogs(updated);
    if (updated.length > 0 && !selectedEmail) {
      setSelectedEmail(updated[0]);
    }
  };

  useEffect(() => {
    refreshLogs();

    const handleOpen = (e) => {
      setIsOpen(true);
      refreshLogs();
      if (e.detail?.emailId) {
        const found = getEmailLogs().find((l) => l.id === e.detail.emailId);
        if (found) setSelectedEmail(found);
      }
    };

    const handleLogsUpdate = () => {
      refreshLogs();
    };

    window.addEventListener('openEmailViewer', handleOpen);
    window.addEventListener('emailLogsUpdated', handleLogsUpdate);
    window.addEventListener('emailDispatched', handleLogsUpdate);

    return () => {
      window.removeEventListener('openEmailViewer', handleOpen);
      window.removeEventListener('emailLogsUpdated', handleLogsUpdate);
      window.removeEventListener('emailDispatched', handleLogsUpdate);
    };
  }, []);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the email log history?')) {
      clearEmailLogs();
      setLogs([]);
      setSelectedEmail(null);
    }
  };

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleSendTest = (e) => {
    e.preventDefault();
    if (!testEmailInput.trim()) return;

    setTestLoading(true);
    setTestStatus('');

    setTimeout(() => {
      const res = sendTestEmail(testEmailInput.trim(), testSubjectInput.trim(), testMessageInput.trim());
      setTestLoading(false);
      if (res.success) {
        setTestStatus(`✓ Live test email & OTP [${res.otpCode}] dispatched to ${testEmailInput.trim()}`);
        refreshLogs();
        setTimeout(() => {
          setActiveTab('inbox');
          setTestStatus('');
        }, 1500);
      } else {
        setTestStatus(`✕ Failed: ${res.error}`);
      }
    }, 400);
  };

  const filteredLogs = logs.filter((log) => {
    if (filterType === 'otp' && !log.otpCode) return false;
    if (filterType === 'orders' && !log.type?.includes('order')) return false;
    if (filterType === 'inquiry' && !log.type?.includes('inquiry')) return false;

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      return (
        log.to?.toLowerCase().includes(query) ||
        log.subject?.toLowerCase().includes(query) ||
        (log.otpCode && log.otpCode.includes(query))
      );
    }
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-3 sm:p-6 backdrop-blur-xs animate-fade-in">
      <div className="flex h-full max-h-[92vh] w-full max-w-5xl flex-col rounded-3xl border border-amber-500/30 bg-[#090B0E] text-white shadow-2xl overflow-hidden">

        {/* Modal Top Navigation Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-[#11141C] px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-2xs">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  Krishna Mail &amp; OTP Activity Center
                </h2>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-emerald-400">
                  Engine Online
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Inspect real-time delivered customer emails, OTP security keys, and invoice receipts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'inbox' ? 'test' : 'inbox')}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'test'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Send className="h-3 w-3" />
              <span>{activeTab === 'test' ? 'Back to Dispatched Inbox' : 'Send Test Email'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
              aria-label="Close Email Center"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab View: Test Email Sender */}
        {activeTab === 'test' ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 max-w-2xl mx-auto w-full">
            <div className="rounded-3xl border border-slate-800 bg-[#121620] p-6 sm:p-8 space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
                  Diagnostic Tool
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">Send Live Test Email &amp; OTP</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Dispatches a verified sample email with an instant 6-digit OTP code to test email delivery and formatting.
                </p>
              </div>

              {testStatus && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  testStatus.startsWith('✓') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {testStatus}
                </div>
              )}

              <form onSubmit={handleSendTest} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Target Email Address *</label>
                  <input
                    type="email"
                    required
                    value={testEmailInput}
                    onChange={(e) => setTestEmailInput(e.target.value)}
                    placeholder="e.g. yourname@gmail.com or registered user"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Custom Subject (Optional)</label>
                  <input
                    type="text"
                    value={testSubjectInput}
                    onChange={(e) => setTestSubjectInput(e.target.value)}
                    placeholder="[Live Test] Krishna Accessories Email Engine Verification"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Custom Message Note (Optional)</label>
                  <textarea
                    rows={3}
                    value={testMessageInput}
                    onChange={(e) => setTestMessageInput(e.target.value)}
                    placeholder="Custom diagnostic message note..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-white outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={testLoading}
                  className="w-full rounded-full bg-amber-500 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 hover:bg-amber-400 transition shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {testLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span>{testLoading ? 'Dispatching Test Email...' : 'Send Live Test Email'}</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Tab View: Inbox & Previewer Split Layout */
          <div className="flex flex-1 overflow-hidden flex-col md:flex-row">

            {/* Left Sidebar: Dispatched Email List */}
            <div className="flex flex-col border-b md:border-b-0 md:border-r border-slate-800 w-full md:w-[360px] lg:w-[400px] shrink-0 bg-[#0E1118]">

              {/* Filters & Search */}
              <div className="p-3 border-b border-slate-800/80 space-y-2.5">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by email, subject, or OTP..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
                  />
                  <Search className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <div className="flex items-center justify-between gap-1 overflow-x-auto text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-0.5">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setFilterType('all')}
                      className={`px-2.5 py-1 rounded-lg transition ${
                        filterType === 'all' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      All ({logs.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType('otp')}
                      className={`px-2.5 py-1 rounded-lg transition ${
                        filterType === 'otp' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      OTPs
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType('orders')}
                      className={`px-2.5 py-1 rounded-lg transition ${
                        filterType === 'orders' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      Orders
                    </button>
                  </div>

                  {logs.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClear}
                      title="Clear History"
                      className="text-slate-500 hover:text-rose-400 p-1 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Email List Items */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-850">
                {filteredLogs.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    <Mail className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p>No dispatched emails found matching criteria.</p>
                  </div>
                ) : (
                  filteredLogs.map((log) => {
                    const isSelected = selectedEmail?.id === log.id;
                    const isOtp = !!log.otpCode;
                    return (
                      <div
                        key={log.id}
                        onClick={() => setSelectedEmail(log)}
                        className={`p-3.5 transition cursor-pointer text-left ${
                          isSelected ? 'bg-[#1C2230] border-l-4 border-amber-400' : 'hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5">
                            {isOtp ? (
                              <span className="flex h-4 w-4 items-center justify-center rounded bg-amber-500/20 text-amber-400 text-[10px]">
                                🔐
                              </span>
                            ) : (
                              <span className="flex h-4 w-4 items-center justify-center rounded bg-blue-500/20 text-blue-400 text-[10px]">
                                ✉️
                              </span>
                            )}
                            <span className="text-[11px] font-bold text-slate-200 truncate max-w-[180px]">
                              {log.to}
                            </span>
                          </div>
                          <span className="text-[9.5px] text-slate-500 whitespace-nowrap">
                            {log.formattedTime || 'Recent'}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-300 line-clamp-1 mb-1">
                          {log.subject}
                        </p>

                        {isOtp && (
                          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded px-2 py-0.5 text-[10.5px] font-mono font-bold text-amber-300 mt-0.5">
                            <span>OTP:</span>
                            <span className="tracking-widest">{log.otpCode}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

            </div>

            {/* Right Pane: Live HTML Email Preview */}
            <div className="flex-1 flex flex-col bg-[#06080B] overflow-hidden">
              {selectedEmail ? (
                <div className="flex-1 flex flex-col h-full overflow-hidden">

                  {/* Preview Header Metadata Card */}
                  <div className="bg-[#121620] border-b border-slate-800 p-4 shrink-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {selectedEmail.subject}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          Status: {selectedEmail.status || 'Delivered'}
                        </span>
                        {selectedEmail.otpCode && (
                          <button
                            type="button"
                            onClick={() => handleCopyCode(selectedEmail.otpCode)}
                            className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-xs transition cursor-pointer"
                          >
                            {copiedOtp ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            <span>{copiedOtp ? 'Copied' : `Copy OTP: ${selectedEmail.otpCode}`}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                      <div>
                        To: <strong className="text-slate-200">{selectedEmail.to}</strong>
                      </div>
                      <div className="sm:text-right text-slate-500">
                        Delivered on: {selectedEmail.formattedDate} at {selectedEmail.formattedTime}
                      </div>
                    </div>
                  </div>

                  {/* Sandboxed HTML Email Preview Body */}
                  <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-900/40 flex justify-center">
                    <div className="w-full max-w-[620px] bg-white rounded-2xl shadow-xl overflow-hidden text-gray-900">
                      <div
                        className="email-html-wrapper"
                        dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
                      />
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-500 text-xs">
                  <div>
                    <Mail className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p className="font-semibold text-slate-400">Select an email from the left to preview</p>
                    <p className="mt-1">All real-time customer and verification emails will appear here.</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
