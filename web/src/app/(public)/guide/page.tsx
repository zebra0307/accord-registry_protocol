"use client";

import Link from "next/link";

export default function SystemGuidePage() {
    return (
        <div className="min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Accord Registry System Guide
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Understanding roles, permissions, and how the platform works
                    </p>
                </div>

                {/* Quick Navigation */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: "Roles", href: "#roles", icon: "👥" },
                        { label: "Trading", href: "#trading", icon: "💱" },
                        { label: "Governance", href: "#governance", icon: "🏛️" },
                        { label: "Lifecycle", href: "#lifecycle", icon: "🔄" },
                    ].map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="p-4 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-center hover:border-emerald-500/30 transition-colors"
                        >
                            <div className="text-3xl mb-2">{item.icon}</div>
                            <div className="text-gray-900 dark:text-white font-medium">{item.label}</div>
                        </a>
                    ))}
                </div>

                {/* Roles Section */}
                <section id="roles" className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <span className="text-3xl mr-3">👥</span> User Roles & Permissions
                    </h2>

                    <div className="space-y-4">
                        {/* Developer/User */}
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                        <span className="text-gray-600 dark:text-gray-400 mr-2">1.</span>
                                        Developer / User
                                        <span className="ml-3 px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs">Default</span>
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        The default role for anyone who connects a wallet. Project owners who want to register carbon projects.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 grid md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-emerald-400 font-medium mb-2">✓ Can Do</div>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        <li>• Register carbon credit projects</li>
                                        <li>• Upload documentation & monitoring data</li>
                                        <li>• Buy credits from marketplace</li>
                                        <li>• Sell their own credits</li>
                                        <li>• Add liquidity to DEX pools</li>
                                        <li>• Retire credits for offsets</li>
                                    </ul>
                                </div>
                                <div>
                                    <div className="text-sm text-red-400 font-medium mb-2">✗ Cannot Do</div>
                                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        <li>• Verify other projects</li>
                                        <li>• Issue government approvals</li>
                                        <li>• Manage other users</li>
                                        <li>• Create governance proposals</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Validator */}
                        <div className="bg-gray-800/50 border border-blue-500/30 rounded-xl p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                        <span className="text-gray-600 dark:text-gray-400 mr-2">2.</span>
                                        Validator
                                        <span className="ml-3 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Assigned</span>
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        Accredited auditors who verify carbon projects and approve credit issuance.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 grid md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-emerald-400 font-medium mb-2">✓ Can Do</div>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        <li>• Review pending project submissions</li>
                                        <li>• Verify or reject projects</li>
                                        <li>• Approve carbon tonnage amounts</li>
                                        <li>• Review DePIN monitoring data</li>
                                        <li>• Earn verification fees from escrow</li>
                                        <li>• All User permissions</li>
                                    </ul>
                                </div>
                                <div>
                                    <div className="text-sm text-yellow-400 font-medium mb-2">💰 How to Become</div>
                                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        <li>1. Complete full KYC verification</li>
                                        <li>2. Provide accreditation proof</li>
                                        <li>3. SuperAdmin creates proposal</li>
                                        <li>4. Multi-sig approval (2/3 admins)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Government */}
                        <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                        <span className="text-gray-600 dark:text-gray-400 mr-2">3.</span>
                                        Government Official
                                        <span className="ml-3 px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">Assigned</span>
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        Authorized government representatives for Article 6 compliance and cross-border transfers.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 grid md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-emerald-400 font-medium mb-2">✓ Can Do</div>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        <li>• Issue Letter of Authorization (LoA)</li>
                                        <li>• Approve CCTS registry compliance</li>
                                        <li>• Set export/import limits</li>
                                        <li>• Manage corresponding adjustments</li>
                                        <li>• All User permissions</li>
                                    </ul>
                                </div>
                                <div>
                                    <div className="text-sm text-yellow-400 font-medium mb-2">💰 How to Become</div>
                                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        <li>1. Government entity verification</li>
                                        <li>2. Official documentation</li>
                                        <li>3. Ministry approval letter</li>
                                        <li>4. Multi-sig approval required</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Admin */}
                        <div className="bg-gray-800/50 border border-orange-500/30 rounded-xl p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                        <span className="text-gray-600 dark:text-gray-400 mr-2">4.</span>
                                        Admin
                                        <span className="ml-3 px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">Multi-Sig Member</span>
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        Part of the multi-signature governance. Can vote on proposals but cannot act alone.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 grid md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-emerald-400 font-medium mb-2">✓ Can Do</div>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        <li>• Create governance proposals</li>
                                        <li>• Vote to approve/reject proposals</li>
                                        <li>• View audit logs</li>
                                        <li>• View all user data</li>
                                    </ul>
                                </div>
                                <div>
                                    <div className="text-sm text-red-400 font-medium mb-2">✗ Cannot Do Alone</div>
                                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        <li>• Execute proposals without approval</li>
                                        <li>• Add/remove other admins</li>
                                        <li>• Emergency pause system</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* SuperAdmin */}
                        <div className="bg-gray-800/50 border border-red-500/30 rounded-xl p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                        <span className="text-gray-600 dark:text-gray-400 mr-2">5.</span>
                                        SuperAdmin
                                        <span className="ml-3 px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">Emergency Authority</span>
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        Has emergency powers in addition to Admin privileges. Set at program deployment.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 grid md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-emerald-400 font-medium mb-2">✓ Can Do</div>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        <li>• Everything an Admin can do</li>
                                        <li>• Add new admins to multi-sig</li>
                                        <li>• Change approval threshold</li>
                                        <li>• Emergency pause system</li>
                                        <li>• Transfer authority</li>
                                    </ul>
                                </div>
                                <div>
                                    <div className="text-sm text-purple-400 font-medium mb-2">⚡ Emergency Powers</div>
                                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        <li>• Can pause all transactions</li>
                                        <li>• Freeze compromised accounts</li>
                                        <li>• Halt DEX if exploit detected</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trading Section */}
                <section id="trading" className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <span className="text-3xl mr-3">💱</span> Who Can Trade?
                    </h2>

                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b border-gray-700">
                                        <th className="pb-3 text-gray-600 dark:text-gray-400">Action</th>
                                        <th className="pb-3 text-gray-600 dark:text-gray-400 text-center">User</th>
                                        <th className="pb-3 text-gray-600 dark:text-gray-400 text-center">Validator</th>
                                        <th className="pb-3 text-gray-600 dark:text-gray-400 text-center">Government</th>
                                        <th className="pb-3 text-gray-600 dark:text-gray-400 text-center">Admin</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
                                    <tr>
                                        <td className="py-3 text-gray-900 dark:text-white">Buy credits on Marketplace</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 text-gray-900 dark:text-white">Sell own credits</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 text-gray-900 dark:text-white">Swap on DEX</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 text-gray-900 dark:text-white">Add Liquidity to Pools</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 text-gray-900 dark:text-white">Retire credits for offset</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 text-gray-900 dark:text-white">Register projects</td>
                                        <td className="py-3 text-center text-emerald-400">✓</td>
                                        <td className="py-3 text-center text-gray-500">-</td>
                                        <td className="py-3 text-center text-gray-500">-</td>
                                        <td className="py-3 text-center text-gray-500">-</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                        <div className="flex items-start space-x-3">
                            <span className="text-2xl">💡</span>
                            <div>
                                <p className="text-blue-400 font-medium">Anyone Can Trade!</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                    All connected wallets can participate in the marketplace and DEX. Role-specific features are for
                                    specialized actions like verification (Validators) or compliance (Government).
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Governance Section */}
                <section id="governance" className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <span className="text-3xl mr-3">🏛️</span> Multi-Signature Governance
                    </h2>

                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 mb-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">How Proposals Work</h3>
                        <div className="grid md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-2xl mx-auto mb-2">1</div>
                                <div className="text-sm text-gray-900 dark:text-white font-medium">Create</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Admin creates proposal</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-2xl mx-auto mb-2">2</div>
                                <div className="text-sm text-gray-900 dark:text-white font-medium">Vote</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Other admins approve</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-2xl mx-auto mb-2">3</div>
                                <div className="text-sm text-gray-900 dark:text-white font-medium">Threshold</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">2 of 3 required</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-2xl mx-auto mb-2">✓</div>
                                <div className="text-sm text-gray-900 dark:text-white font-medium">Execute</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Action takes effect</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Proposal Types</h3>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center text-gray-300">
                                    <span className="text-xl mr-3">👤</span> Assign/Revoke Roles
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <span className="text-xl mr-3">➕</span> Add/Remove Admins
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <span className="text-xl mr-3">🎚️</span> Change Approval Threshold
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <span className="text-xl mr-3">⚙️</span> Update Registry Settings
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <span className="text-xl mr-3">⏸️</span> Emergency Pause
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <span className="text-xl mr-3">🔑</span> Transfer Authority
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Current Configuration</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Total Admins</span>
                                    <span className="text-gray-900 dark:text-white font-medium">3</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Approval Threshold</span>
                                    <span className="text-gray-900 dark:text-white font-medium">2 of 3</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Emergency Admin</span>
                                    <span className="text-purple-400 font-mono text-sm">5abc...xyz</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                                    <span className="text-emerald-400 font-medium">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Lifecycle Section */}
                <section id="lifecycle" className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <span className="text-3xl mr-3">🔄</span> Carbon Credit Lifecycle
                    </h2>

                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                        <div className="flex flex-wrap justify-center gap-2 items-center">
                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-center min-w-[120px]">
                                <div className="text-2xl mb-1">📝</div>
                                <div className="text-sm text-gray-900 dark:text-white">Register</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Developer</div>
                            </div>
                            <div className="text-gray-600">→</div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-center min-w-[120px]">
                                <div className="text-2xl mb-1">🔍</div>
                                <div className="text-sm text-gray-900 dark:text-white">Verify</div>
                                <div className="text-xs text-blue-400">Validator</div>
                            </div>
                            <div className="text-gray-600">→</div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-center min-w-[120px]">
                                <div className="text-2xl mb-1">🏛️</div>
                                <div className="text-sm text-gray-900 dark:text-white">LoA</div>
                                <div className="text-xs text-purple-400">Government</div>
                            </div>
                            <div className="text-gray-600">→</div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-center min-w-[120px]">
                                <div className="text-2xl mb-1">🪙</div>
                                <div className="text-sm text-gray-900 dark:text-white">Mint</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Automatic</div>
                            </div>
                            <div className="text-gray-600">→</div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-center min-w-[120px]">
                                <div className="text-2xl mb-1">💱</div>
                                <div className="text-sm text-gray-900 dark:text-white">Trade</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Anyone</div>
                            </div>
                            <div className="text-gray-600">→</div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-center min-w-[120px]">
                                <div className="text-2xl mb-1">🔥</div>
                                <div className="text-sm text-gray-900 dark:text-white">Retire</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Owner</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="text-center">
                    <Link
                        href="/dashboard"
                        className="inline-flex px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-gray-900 dark:text-white font-semibold text-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
