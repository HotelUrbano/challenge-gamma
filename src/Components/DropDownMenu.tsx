import React from "react"
import styled from "styled-components";
import { CgSpinner } from 'react-icons/cg'
import { DropdownItem } from "./styled";

function DropDownMenu({ data, loading, onClickOption, ...rest }: any, ref: React.ForwardedRef<any>) {
    function getDropdownOptions() {
        if (data.length) {
            return (
                data.length && data.map((option: any) => (
                    <DropdownItem
                        selectable
                        key={option.id}
                        onClick={() => {
                            if (onClickOption) {
                                return onClickOption(option)
                            }
                        }}>
                        {option.value}
                    </DropdownItem>
                ))
            )
        } else if (!loading) {
            return (
                < DropdownItem >
                    No Results
                </DropdownItem>
            )
        }
    }
    return (
        <div ref={ref} {...rest}>
            {loading && <Spinner />}
            {getDropdownOptions()}
        </div >
    )
}

export default React.forwardRef(DropDownMenu)

const Spinner = styled(CgSpinner)`
    animation: spin infinite 2s linear;
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`