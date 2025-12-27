"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useKYCStore, KYCLevel } from "@/stores/useKYCStore";
import Link from "next/link";

// Simulated verification codes (in production, these come from backend)
const DEMO_EMAIL_CODE = "123456";
const DEMO_PHONE_CODE = "654321";

function KYCPageContent() {
    const { publicKey, connected } = useWallet();
    const {
        level,
        status,
        emailVerified,
        phoneVerified,
        email,
        phone,
        documents,
        submittedAt,
        setEmailVerified,
        setPhoneVerified,
        addDocument,
        submitKYC,
        approveKYC,
        setLevel,
        setStatus,
    } = useKYCStore();

    const [activeTab, setActiveTab] = useState<"status" | "verify" | "limits">("status");

    // Form state for email verification
    const [emailInput, setEmailInput] = useState("");
    const [emailCode, setEmailCode] = useState("");
    const [emailCodeSent, setEmailCodeSent] = useState(false);
    const [emailVerifying, setEmailVerifying] = useState(false);

    // Form state for phone verification
    const [phoneInput, setPhoneInput] = useState("");
    const [phoneCode, setPhoneCode] = useState("");
    const [phoneCodeSent, setPhoneCodeSent] = useState(false);
    const [phoneVerifying, setPhoneVerifying] = useState(false);

    // Document upload state
    const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({});
    const [uploading, setUploading] = useState(false);

    const walletAddress = publicKey?.toBase58() || "";

    // Check if Level 1 is complete (both email and phone verified)
    const isLevel1Complete = emailVerified && phoneVerified;

    // Check if Level 2 documents are ready
    const level2DocsReady = uploadedFiles.governmentId && uploadedFiles.selfie && uploadedFiles.proofOfAddress;

    // ==================== EMAIL VERIFICATION ====================
    const handleSendEmailCode = async () => {
        if (!emailInput || !emailInput.includes("@")) {
            alert("Please enter a valid email address");
            return;
        }

        setEmailVerifying(true);
        // Simulate API call to send email
        await new Promise(r => setTimeout(r, 1500));
        setEmailCodeSent(true);
        setEmailVerifying(false);

        // Show the demo code in development
        alert(`📧 Verification code sent to ${emailInput}\n\nDemo code: ${DEMO_EMAIL_CODE}`);
    };

    const handleVerifyEmail = async () => {
        if (emailCode.length !== 6) {
            alert("Please enter a 6-digit code");
            return;
        }

        setEmailVerifying(true);
        await new Promise(r => setTimeout(r, 1000));

        if (emailCode === DEMO_EMAIL_CODE) {
            setEmailVerified(true, emailInput);
            setEmailCode("");
            alert("✅ Email verified successfully!");
        } else {
            alert("❌ Invalid code. Try: " + DEMO_EMAIL_CODE);
        }
        setEmailVerifying(false);
    };

    // ==================== PHONE VERIFICATION ====================
    const handleSendPhoneCode = async () => {
        if (!phoneInput || phoneInput.length < 10) {
            alert("Please enter a valid phone number");
            return;
        }

        setPhoneVerifying(true);
        // Simulate API call to send SMS
        await new Promise(r => setTimeout(r, 1500));
        setPhoneCodeSent(true);
        setPhoneVerifying(false);

        // Show the demo code in development
        alert(`📱 Verification code sent to ${phoneInput}\n\nDemo code: ${DEMO_PHONE_CODE}`);
    };

    const handleVerifyPhone = async () => {
        if (phoneCode.length !== 6) {
            alert("Please enter a 6-digit code");
            return;
        }

        setPhoneVerifying(true);
        await new Promise(r => setTimeout(r, 1000));

        if (phoneCode === DEMO_PHONE_CODE) {
            setPhoneVerified(true, phoneInput);
            setPhoneCode("");
            alert("✅ Phone verified successfully!");
        } else {
            alert("❌ Invalid code. Try: " + DEMO_PHONE_CODE);
        }
        setPhoneVerifying(false);
    };

    // ==================== COMPLETE LEVEL 1 ====================
    const handleCompleteLevel1 = async () => {
        if (!isLevel1Complete) {
            alert("Please verify both email and phone first");
            return;
        }

        setUploading(true);
        await new Promise(r => setTimeout(r, 1000));

        // Update KYC level to 1
        setLevel(1);
        setStatus("approved");

        alert("🎉 Level 1 KYC Complete! You can now register projects and trade on the marketplace.");
        setActiveTab("status");
        setUploading(false);
    };

    // ==================== DOCUMENT UPLOAD ====================
    const handleFileUpload = (docId: string, file: File | null) => {
        setUploadedFiles(prev => ({ ...prev, [docId]: file }));
    };

    // ==================== SUBMIT LEVEL 2 ====================
    const handleSubmitLevel2 = async () => {
        if (!level2DocsReady) {
            alert("Please upload all required documents");
            return;
        }

        setUploading(true);

        // Simulate document upload to IPFS/backend
        await new Promise(r => setTimeout(r, 2000));

        // Add documents to store
        Object.entries(uploadedFiles).forEach(([id, file]) => {
            if (file) {
                addDocument({
                    id,
                    type: id,
                    fileName: file.name,
                    hash: `hash_${Date.now()}_${id}`,
                    uploadedAt: new Date().toISOString(),
                    status: "pending",
                });
            }
        });

        // Submit for review
        submitKYC(2);
        setLevel(2);
        setStatus("pending");

        alert("📋 Level 2 KYC submitted for review!\n\nAn admin will review your documents within 2-5 business days.");
        setActiveTab("status");
        setUploading(false);
    };

    // ==================== RENDER ====================
    if (!connected) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Connect Your Wallet</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please connect your wallet to access KYC verification.</p>
                </div>
            </div>
        );
    }

    // Level info for display
    const levelInfo = {
        0: { name: "Unverified", icon: "⚪", color: "gray" },
        1: { name: "Basic", icon: "🟡", color: "yellow" },
        2: { name: "Full", icon: "🟢", color: "emerald" },
    }[level];

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm mb-2">
                        <Link href="/settings" className="hover:text-gray-900 dark:hover:text-white">Settings</Link>
                        <span>/</span>
                        <span className="text-gray-900 dark:text-white">KYC Verification</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">KYC Verification</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Verify your identity to unlock all platform features</p>
                </div>

                {/* Current Status Card */}
                <div className={`bg-${levelInfo.color}-500/10 border border-${levelInfo.color}-500/30 rounded-xl p-6 mb-8`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="text-4xl">{levelInfo.icon}</div>
                            <div>
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                    KYC Level {level}: {levelInfo.name}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400 text-sm">
                                    {status === "pending" ? (
                                        <span className="text-yellow-400">⏳ Verification pending admin review...</span>
                                    ) : status === "approved" ? (
                                        <span className="text-emerald-400">✅ Verification approved</span>
                                    ) : status === "rejected" ? (
                                        <span className="text-red-400">❌ Verification rejected</span>
                                    ) : (
                                        "Complete verification to unlock features"
                                    )}
                                </div>
                            </div>
                        </div>
                        {level < 2 && status !== "pending" && (
                            <button
                                onClick={() => setActiveTab("verify")}
                                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-gray-900 dark:text-white font-semibold"
                            >
                                Upgrade to Level {level + 1}
                            </button>
                        )}
                    </div>
                </div>

                {/* Pending Status Banner */}
                {status === "pending" && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8">
                        <div className="flex items-start space-x-4">
                            <div className="text-3xl">⏳</div>
                            <div>
                                <h3 className="font-semibold text-yellow-400 mb-2">KYC Verification Pending</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                    Your Level 2 documents have been submitted and are awaiting admin review.
                                    This typically takes 2-5 business days.
                                </p>
                                <div className="flex items-center space-x-4 text-sm">
                                    <span className="text-gray-500">Submitted: {submittedAt ? new Date(submittedAt).toLocaleDateString() : "N/A"}</span>
                                    <span className="text-gray-700">|</span>
                                    <span className="text-gray-500">Documents: {documents.length} uploaded</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex space-x-2 mb-8">
                    {[
                        { id: "status", label: "Status", icon: "📊" },
                        { id: "verify", label: "Verify", icon: "✅" },
                        { id: "limits", label: "Feature Access", icon: "🔓" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2 ${activeTab === tab.id
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Status Tab */}
                {activeTab === "status" && (
                    <div className="space-y-6">
                        {/* Verification Progress */}
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Verification Progress</h2>

                            <div className="relative">
                                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-700" />

                                <div className="space-y-8">
                                    {/* Level 0 */}
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center z-10 bg-emerald-500 text-gray-900 dark:text-white">
                                            ✓
                                        </div>
                                        <div className="flex-1 pt-2">
                                            <div className="font-semibold text-gray-900 dark:text-white">Level 0: Account Created</div>
                                            <div className="text-gray-600 dark:text-gray-400 text-sm">Wallet connected</div>
                                        </div>
                                    </div>

                                    {/* Level 1 */}
                                    <div className="flex items-start space-x-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${level >= 1 ? "bg-emerald-500 text-gray-900 dark:text-white" :
                                                isLevel1Complete ? "bg-yellow-500 text-gray-900 dark:text-white" : "bg-gray-700 text-gray-600 dark:text-gray-400"
                                            }`}>
                                            {level >= 1 ? "✓" : isLevel1Complete ? "!" : "1"}
                                        </div>
                                        <div className="flex-1 pt-2">
                                            <div className="font-semibold text-gray-900 dark:text-white">Level 1: Basic Verification</div>
                                            <div className="text-gray-600 dark:text-gray-400 text-sm">Email and phone verification</div>
                                            <div className="flex items-center space-x-4 mt-2 text-sm">
                                                <span className={emailVerified ? "text-emerald-400" : "text-gray-500"}>
                                                    {emailVerified ? "✅" : "○"} Email {email && `(${email})`}
                                                </span>
                                                <span className={phoneVerified ? "text-emerald-400" : "text-gray-500"}>
                                                    {phoneVerified ? "✅" : "○"} Phone {phone && `(${phone})`}
                                                </span>
                                            </div>
                                            {isLevel1Complete && level < 1 && (
                                                <button
                                                    onClick={handleCompleteLevel1}
                                                    className="mt-3 px-4 py-2 bg-emerald-500 rounded-lg text-gray-900 dark:text-white text-sm font-medium"
                                                >
                                                    Complete Level 1
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Level 2 */}
                                    <div className="flex items-start space-x-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${level >= 2 && status === "approved" ? "bg-emerald-500 text-gray-900 dark:text-white" :
                                                status === "pending" ? "bg-yellow-500 text-gray-900 dark:text-white animate-pulse" :
                                                    "bg-gray-700 text-gray-600 dark:text-gray-400"
                                            }`}>
                                            {level >= 2 && status === "approved" ? "✓" : status === "pending" ? "⏳" : "2"}
                                        </div>
                                        <div className="flex-1 pt-2">
                                            <div className="font-semibold text-gray-900 dark:text-white">Level 2: Full Verification</div>
                                            <div className="text-gray-600 dark:text-gray-400 text-sm">Government ID and proof of address</div>
                                            {status === "pending" && (
                                                <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                                    <div className="text-yellow-400 text-sm font-medium">⏳ Pending Admin Review</div>
                                                    <div className="text-gray-500 text-xs mt-1">
                                                        Submitted: {submittedAt ? new Date(submittedAt).toLocaleString() : "N/A"}
                                                    </div>
                                                </div>
                                            )}
                                            {documents.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {documents.map((doc) => (
                                                        <span key={doc.id} className={`px-2 py-1 rounded text-xs ${doc.status === "approved" ? "bg-emerald-500/10 text-emerald-400" :
                                                                doc.status === "pending" ? "bg-yellow-500/10 text-yellow-400" :
                                                                    "bg-red-500/10 text-red-400"
                                                            }`}>
                                                            {doc.type}: {doc.status}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Verify Tab */}
                {activeTab === "verify" && (
                    <div className="space-y-6">
                        {/* Level 1: Basic Verification */}
                        <div className={`bg-gray-800/50 border rounded-xl p-6 ${level >= 1 ? "border-emerald-500/30" : "border-gray-700/50"
                            }`}>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Level 1: Basic Verification</h2>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Verify your email and phone number</p>
                                </div>
                                {level >= 1 && (
                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm">
                                        ✅ Completed
                                    </span>
                                )}
                            </div>

                            {level < 1 ? (
                                <div className="space-y-4">
                                    {/* Email Verification */}
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="font-medium text-gray-900 dark:text-white">📧 Email Address</label>
                                            {emailVerified && <span className="text-emerald-400 text-sm">✅ Verified</span>}
                                        </div>
                                        {!emailVerified ? (
                                            <div className="space-y-3">
                                                <div className="flex space-x-3">
                                                    <input
                                                        type="email"
                                                        value={emailInput}
                                                        onChange={(e) => setEmailInput(e.target.value)}
                                                        placeholder="your@email.com"
                                                        className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                                        disabled={emailCodeSent}
                                                    />
                                                    <button
                                                        onClick={handleSendEmailCode}
                                                        disabled={emailCodeSent || emailVerifying}
                                                        className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 font-medium disabled:opacity-50"
                                                    >
                                                        {emailVerifying ? "Sending..." : emailCodeSent ? "Sent ✓" : "Send Code"}
                                                    </button>
                                                </div>
                                                {emailCodeSent && (
                                                    <div className="flex space-x-3">
                                                        <input
                                                            type="text"
                                                            value={emailCode}
                                                            onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                                            placeholder="Enter 6-digit code"
                                                            maxLength={6}
                                                            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-center text-2xl tracking-widest"
                                                        />
                                                        <button
                                                            onClick={handleVerifyEmail}
                                                            disabled={emailCode.length !== 6 || emailVerifying}
                                                            className="px-6 py-3 bg-emerald-500 rounded-lg text-gray-900 dark:text-white font-medium disabled:opacity-50"
                                                        >
                                                            {emailVerifying ? "..." : "Verify"}
                                                        </button>
                                                    </div>
                                                )}
                                                {emailCodeSent && (
                                                    <p className="text-gray-500 text-sm">
                                                        💡 Demo code: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{DEMO_EMAIL_CODE}</code>
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-emerald-400">{email}</div>
                                        )}
                                    </div>

                                    {/* Phone Verification */}
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="font-medium text-gray-900 dark:text-white">📱 Phone Number</label>
                                            {phoneVerified && <span className="text-emerald-400 text-sm">✅ Verified</span>}
                                        </div>
                                        {!phoneVerified ? (
                                            <div className="space-y-3">
                                                <div className="flex space-x-3">
                                                    <input
                                                        type="tel"
                                                        value={phoneInput}
                                                        onChange={(e) => setPhoneInput(e.target.value)}
                                                        placeholder="+91 9876543210"
                                                        className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                                        disabled={phoneCodeSent}
                                                    />
                                                    <button
                                                        onClick={handleSendPhoneCode}
                                                        disabled={phoneCodeSent || phoneVerifying}
                                                        className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 font-medium disabled:opacity-50"
                                                    >
                                                        {phoneVerifying ? "Sending..." : phoneCodeSent ? "Sent ✓" : "Send Code"}
                                                    </button>
                                                </div>
                                                {phoneCodeSent && (
                                                    <div className="flex space-x-3">
                                                        <input
                                                            type="text"
                                                            value={phoneCode}
                                                            onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                                            placeholder="Enter 6-digit code"
                                                            maxLength={6}
                                                            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-center text-2xl tracking-widest"
                                                        />
                                                        <button
                                                            onClick={handleVerifyPhone}
                                                            disabled={phoneCode.length !== 6 || phoneVerifying}
                                                            className="px-6 py-3 bg-emerald-500 rounded-lg text-gray-900 dark:text-white font-medium disabled:opacity-50"
                                                        >
                                                            {phoneVerifying ? "..." : "Verify"}
                                                        </button>
                                                    </div>
                                                )}
                                                {phoneCodeSent && (
                                                    <p className="text-gray-500 text-sm">
                                                        💡 Demo code: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{DEMO_PHONE_CODE}</code>
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-emerald-400">{phone}</div>
                                        )}
                                    </div>

                                    {/* Complete Level 1 Button */}
                                    {isLevel1Complete && (
                                        <button
                                            onClick={handleCompleteLevel1}
                                            disabled={uploading}
                                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-gray-900 dark:text-white font-semibold disabled:opacity-50"
                                        >
                                            {uploading ? "Completing..." : "🎉 Complete Level 1 Verification"}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">✅</span>
                                        <div>
                                            <div className="text-emerald-400 font-medium">Level 1 Complete!</div>
                                            <div className="text-gray-600 dark:text-gray-400 text-sm">Email and phone verified</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Level 2: Full Verification */}
                        <div className={`bg-gray-800/50 border rounded-xl p-6 ${level < 1 ? "opacity-50 pointer-events-none border-gray-700/50" :
                                status === "pending" ? "border-yellow-500/30" :
                                    level >= 2 && status === "approved" ? "border-emerald-500/30" : "border-gray-700/50"
                            }`}>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Level 2: Full Verification</h2>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Upload identity documents for unlimited access</p>
                                </div>
                                {level < 1 && (
                                    <span className="px-3 py-1 bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                                        🔒 Complete Level 1 first
                                    </span>
                                )}
                                {status === "pending" && (
                                    <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-sm animate-pulse">
                                        ⏳ Pending Review
                                    </span>
                                )}
                            </div>

                            {status === "pending" ? (
                                <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
                                    <div className="text-4xl mb-3">⏳</div>
                                    <h3 className="text-lg font-semibold text-yellow-400 mb-2">Verification In Progress</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                        Your documents have been submitted and are awaiting admin review.
                                        This typically takes 2-5 business days.
                                    </p>
                                    <div className="text-gray-500 text-sm">
                                        Submitted: {submittedAt ? new Date(submittedAt).toLocaleString() : "N/A"}
                                    </div>
                                </div>
                            ) : level >= 2 && status === "approved" ? (
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">✅</span>
                                        <div>
                                            <div className="text-emerald-400 font-medium">Level 2 Complete!</div>
                                            <div className="text-gray-600 dark:text-gray-400 text-sm">Full verification approved</div>
                                        </div>
                                    </div>
                                </div>
                            ) : level >= 1 ? (
                                <div className="space-y-4">
                                    {/* Government ID */}
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <label className="font-medium text-gray-900 dark:text-white block mb-3">
                                            🪪 Government-issued ID <span className="text-red-400">*</span>
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => handleFileUpload("governmentId", e.target.files?.[0] || null)}
                                                className="hidden"
                                                id="file-governmentId"
                                            />
                                            <label
                                                htmlFor="file-governmentId"
                                                className="flex-1 p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-center cursor-pointer hover:border-emerald-500/50 transition-colors"
                                            >
                                                {uploadedFiles.governmentId ? (
                                                    <span className="text-emerald-400">📎 {uploadedFiles.governmentId.name}</span>
                                                ) : (
                                                    <span className="text-gray-600 dark:text-gray-400">Click to upload (Passport, Aadhar, License)</span>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    {/* Selfie with ID */}
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <label className="font-medium text-gray-900 dark:text-white block mb-3">
                                            🤳 Selfie holding your ID <span className="text-red-400">*</span>
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                onChange={(e) => handleFileUpload("selfie", e.target.files?.[0] || null)}
                                                className="hidden"
                                                id="file-selfie"
                                            />
                                            <label
                                                htmlFor="file-selfie"
                                                className="flex-1 p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-center cursor-pointer hover:border-emerald-500/50 transition-colors"
                                            >
                                                {uploadedFiles.selfie ? (
                                                    <span className="text-emerald-400">📎 {uploadedFiles.selfie.name}</span>
                                                ) : (
                                                    <span className="text-gray-600 dark:text-gray-400">Click to upload (Clear photo of you holding ID)</span>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    {/* Proof of Address */}
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <label className="font-medium text-gray-900 dark:text-white block mb-3">
                                            🏠 Proof of Address <span className="text-red-400">*</span>
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => handleFileUpload("proofOfAddress", e.target.files?.[0] || null)}
                                                className="hidden"
                                                id="file-proofOfAddress"
                                            />
                                            <label
                                                htmlFor="file-proofOfAddress"
                                                className="flex-1 p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-center cursor-pointer hover:border-emerald-500/50 transition-colors"
                                            >
                                                {uploadedFiles.proofOfAddress ? (
                                                    <span className="text-emerald-400">📎 {uploadedFiles.proofOfAddress.name}</span>
                                                ) : (
                                                    <span className="text-gray-600 dark:text-gray-400">Click to upload (Utility bill, Bank statement)</span>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        onClick={handleSubmitLevel2}
                                        disabled={!level2DocsReady || uploading}
                                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-gray-900 dark:text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {uploading ? "Submitting..." : "📋 Submit for Level 2 Verification"}
                                    </button>

                                    <p className="text-gray-500 text-sm text-center">
                                        Your documents will be reviewed by our admin team within 2-5 business days.
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}

                {/* Feature Access Tab */}
                {activeTab === "limits" && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl overflow-hidden">
                            <div className="p-6 border-b border-gray-700/50">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Feature Access by KYC Level</h2>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                    Your current level: <span className="text-emerald-400 font-semibold">Level {level}</span>
                                    {status === "pending" && <span className="text-yellow-400 ml-2">(Level 2 pending)</span>}
                                </p>
                            </div>

                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900/50">
                                    <tr>
                                        <th className="text-left p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">Feature</th>
                                        <th className="text-center p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">Level 0</th>
                                        <th className="text-center p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">Level 1</th>
                                        <th className="text-center p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">Level 2</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
                                    {[
                                        { feature: "Register Carbon Projects", levels: [false, true, true] },
                                        { feature: "Max Project Size", levels: ["—", "1,000 credits", "Unlimited"] },
                                        { feature: "Trade on Marketplace", levels: [false, true, true] },
                                        { feature: "Trade on DEX", levels: [false, false, true] },
                                        { feature: "Monthly Trade Volume", levels: ["$0", "$5,000", "Unlimited"] },
                                        { feature: "Retire Credits", levels: [false, true, true] },
                                        { feature: "Request Role Upgrade", levels: [false, false, true] },
                                        { feature: "Cross-Border Trading", levels: [false, false, true] },
                                        { feature: "API Access", levels: [false, false, true] },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-200 dark:hover:bg-gray-700/20">
                                            <td className="p-4 text-gray-900 dark:text-white">{row.feature}</td>
                                            {row.levels.map((val, j) => (
                                                <td key={j} className={`p-4 text-center ${j === level ? "bg-emerald-500/5" : ""}`}>
                                                    {typeof val === "boolean" ? (
                                                        val ? <span className="text-emerald-400">✅</span> : <span className="text-gray-500">❌</span>
                                                    ) : (
                                                        <span className={j === level ? "text-emerald-400 font-semibold" : "text-gray-600 dark:text-gray-400"}>
                                                            {val}
                                                        </span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Wrapper for SSR protection
export default function KYCPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return <KYCPageContent />;
}
