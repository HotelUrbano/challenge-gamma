import styled, { css } from "styled-components";
import WeatherIcon from "../Icons/WeatherIcon";

export const Card = styled.div<{ loadingElement: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0 auto;
  width: 65%;
  box-sizing: border-box;
  color: ${({ loadingElement }) =>
    loadingElement
      ? "rgba(255,255,255,0.6) !important"
      : "rgba(255,255,255,1)"};
  font-size: 22px;

  @media (max-width: 770px) {
    font-size: 18px;
  }

  @media (max-width: 500px) {
    width: 100%;
  }
`;

export const SearchBarArea = styled.div`
  color: #817e7c;
  height: 10%;
  position: relative;

  input {
    color: #817e7c;
    background-color: rgb(255, 255, 255, 0.9);
    width: 100%;
    padding: 0 15px 2px 65px;
    height: 100%;
    border: 0;
    outline: unset;
    font-size: 35px;
    text-overflow: ellipsis;
  }
`;

export const IconWrapper = styled.div`
  position: absolute;
  height: 100%;
  padding: 5px;

  svg {
    height: 100%;
    font-size: 55px;
  }
`;

export const StyledDropdown = styled.div`
  z-index: 99;
  top: -1px !important;
  border-top: 1px solid #ddd;
  margin: 0 auto;
  width: 65%;
  background-color: rgb(255 255 255 / 95%);
  padding: 30px 20px;
  color: #817e7c;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;

  @media (max-width: 500px) {
    width: 98%;
  }
`;

export const DropdownItem = styled.li<{ selectable?: boolean }>`
  cursor: ${({ selectable }) => (selectable ? "pointer" : "auto")};
  padding: 8px 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

type ForecastAreaProps = {
  tempColor: string;
  initialLoading: boolean;
};

export const ForecastArea = styled.div<ForecastAreaProps>`
  position: relative;
  display: flex;
  background-color: ${({ tempColor }) => tempColor};
  flex-wrap: wrap;
  font-weight: 600;

  transition: background-color 500ms linear;

  &.today {
    flex-grow: 1;
    justify-content: center;
  }
  &.tomorrow,
  &.day-after-tomorrow {
    height: 15%;
    background-color: ${({ tempColor }) => tempColor};

    > div {
      margin-left: auto;
    }
  }

  @media (max-width: 770px) {
    > div {
      margin-left: auto;
      margin-right: auto;
    }
  }

  ${({ initialLoading }) =>
    initialLoading
      ? css`
          &:before {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            height: 100%;
            width: 200px;
            background: linear-gradient(
              to right,
              transparent 0%,
              rgba(255, 255, 255, 0.05) 25%,
              rgba(255, 255, 255, 0.05) 75%,
              transparent 100%
            );
            animation: load 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;

            @keyframes load {
              from {
                left: 0;
              }
              to {
                left: calc(100% - 200px);
              }
            }
          }
        `
      : ""};
`;

export const DayLabel = styled.div`
  text-transform: uppercase;
`;

export const InfoArea = styled.div`
  margin: 20px 0;
`;

export const Description = styled.div`
  text-transform: capitalize;
  margin: 15px 0;
`;

export const StyledWeatherIcon = styled(WeatherIcon)`
  height: 100%;
  width: 100%;
`;

export const Block = styled.div<{ loadingBlock: boolean }>`
  position: relative;

  ${({ loadingBlock }) =>
    loadingBlock
      ? css`
          min-width: 200px;
          opacity: 0.2;
          border-radius: 5px;
          color: transparent;
          background-color: #eee;

          &:before {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            height: 100%;
            width: 200px;
            background: linear-gradient(
              to right,
              transparent 0%,
              #fff 50%,
              transparent 100%
            );
            animation: load 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;

            @keyframes load {
              from {
                left: 0;
              }
              to {
                left: calc(100% - 200px);
              }
            }
          }
        `
      : ""};
`;

export const StyledSection = styled.div`
  min-width: 250px;
  padding: 14px;
  width: 50%;
`;

export const Temperature = styled.div`
  cursor: pointer;
`;

export const StyledList = styled.ul`
  padding: 0;
`;
