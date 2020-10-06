import React from "react";

const Approvals = ({ approvals }) => {
    return (
        <div className='grid-container'>
            {approvals.map((item, index) => {
                return (
                    <div className='card'>
                        <div>
                            <p>Block Number</p>
                            <span>{item.blockNumber}</span>
                        </div>
                        <div>
                            <p>Transaction Index</p>
                            <span>{item.transactionIndex}</span>
                        </div>
                        <div>
                            <div>
                                <p>Approved to </p>
                                <a
                                    href={`https://etherscan.io/tx/${item.transactionHash}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    <i className='fas fa-external-link-alt'></i>
                                </a>
                            </div>
                            <span>{item.args.guy}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Approvals;
