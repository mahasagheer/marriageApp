import React from 'react'
import { Button } from '../Layout/Button'

function ConfirmationModal({ onClickCancel, onClickSubmit, cnfrmText
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-sm w-full">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Confirm Deletion</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                    {cnfrmText}      </p>
                <div className="flex justify-end gap-3">
                    <Button
                        onClick={onClickCancel}
                        btnText={"No"}
                        btnColor='dark:bg-gray-700 bg-gray-200'
                        textColor='text-gray-800 dark:text-white'
                        hoverColor='bg-gray-800'
                    />
                    <Button
                        onClick={onClickSubmit}
                        btnText={"Yes"}
                    />
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal