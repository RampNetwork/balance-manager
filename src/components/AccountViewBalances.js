import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import lang from '../languages';
import AssetIcon from './AssetIcon';
import balancesTabIcon from '../assets/balances-tab.svg';
import { convertStringToNumber, hasHighMarketValue, hasLowMarketValue } from '../helpers/bignumber';
import { colors, fonts, shadows, responsive } from '../styles';

const StyledGrid = styled.div`
  width: 100%;
  text-align: right;
  position: relative;
  z-index: 0;
`;

const StyledRow = styled.div`
  width: 100%;
  display: grid;
  position: relative;
  padding: 20px;
  z-index: 0;
  background-color: rgb(${colors.white});
  grid-template-columns: repeat(5, 1fr);
  min-height: 0;
  min-width: 0;
  & p {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: ${fonts.size.h6};
  }
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
  @media screen and (${responsive.sm.max}) {
    grid-template-columns: repeat(5, 1fr);
    padding: 16px;
  }
  @media screen and (${responsive.xs.max}) {
    grid-template-columns: 1fr repeat(3, 3fr);
    & p:nth-child(3) {
      display: none;
    }
  }
`;

const StyledLabelsRow = styled(StyledRow)`
  width: 100%;
  border-width: 0 0 2px 0;
  border-color: rgba(${colors.lightGrey}, 0.4);
  border-style: solid;
  padding: 12px 20px;
  & p:first-child {
    justify-content: flex-start;
  }
`;

const StyledLabels = styled.p`
  text-transform: uppercase;
  font-size: ${fonts.size.small} !important;
  font-weight: ${fonts.weight.semibold};
  color: rgba(${colors.darkGrey}, 0.7);
`;

const StyledEthereum = styled(StyledRow)`
  width: 100%;
  z-index: 2;
  box-shadow: ${shadows.medium};
  & div p {
    font-weight: ${fonts.weight.medium};
  }
  & > p {
    font-weight: ${fonts.weight.semibold};
    font-family: ${fonts.family.SFMono};
  }
`;

const StyledToken = styled(StyledRow)`
  width: 100%;
  & > * {
    font-weight: ${fonts.weight.medium};
    color: rgba(${colors.dark}, 0.6);
  }
  & > p:first-child {
    justify-content: flex-start;
  }
  & > p {
    font-family: ${fonts.family.SFMono};
  }
  &:nth-child(n + 3) {
    border-top: 1px solid rgba(${colors.darkGrey}, 0.1);
  }
`;

const StyledAsset = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  min-height: 0;
  min-width: 0;
  & p {
    font-size: ${fonts.size.medium};
    margin-left: 10px;
  }
  @media screen and (${responsive.xs.max}) {
    & > img {
      margin-left: 12px;
    }
    & p {
      display: none;
    }
  }
`;

const StyledPercentage = styled.p`
  color: ${({ percentage }) =>
    percentage
      ? percentage > 0 ? `rgb(${colors.green})` : percentage < 0 ? `rgb(${colors.red})` : `inherit`
      : `inherit`};
`;

const StyledLastRow = styled(StyledRow)`
  width: 100%;
  z-index: 2;
  grid-template-columns: 3fr 1fr;
  min-height: 0;
  min-width: 0;
  border-top: 1px solid rgba(${colors.darkGrey}, 0.1);
  & > p {
    font-size: ${fonts.size.medium};
    font-weight: ${fonts.weight.semibold};
    font-family: ${fonts.family.SFMono};
  }
  & > p:first-child {
    font-family: ${fonts.family.SFProText};
    justify-content: flex-start;
  }
  @media screen and (${responsive.sm.max}) {
    & p {
      font-size: ${fonts.size.h6};
    }
  }
`;

const StyledShowMoreTokens = styled(StyledToken)`
  grid-template-columns: 100%;
  min-height: 0;
  min-width: 0;
  padding: 0;
  position: relative;
  cursor: pointer;
  text-align: left;
  justify-content: flex-start;
  font-family: ${fonts.family.SFProText};
  font-weight: ${fonts.weight.normal};
  font-size: ${fonts.size.h6};
  color: rgb(${colors.grey});
  padding-left: 18px;

  & div {
    position: absolute;
    position: absolute;
    height: 14px;
    width: 14px;
    left: 0;
    top: calc((100% - 16px) / 2);
    mask: url(${balancesTabIcon}) center no-repeat;
    background-color: rgb(${colors.grey});
  }
  @media (hover: hover) {
    &:hover p {
      opacity: 0.7;
    }
  }
`;

class AccountViewBalances extends Component {
  state = {
    showMoreTokens: false
  };
  onShowMoreTokens = () => {
    this.setState({ showMoreTokens: !this.state.showMoreTokens });
  };
  render() {
    const ethereum = this.props.accountInfo.assets.filter(asset => asset.symbol === 'ETH')[0];
    const tokensWithHighMarketValue = this.props.accountInfo.assets.filter(
      asset => asset.symbol !== 'ETH' && hasHighMarketValue(asset)
    );
    let tokensWithLowMarketValue = this.props.accountInfo.assets.filter(
      asset => asset.symbol !== 'ETH' && hasLowMarketValue(asset)
    );
    const tokensWithNoMarketValue = this.props.accountInfo.assets.filter(asset => !asset.native);
    tokensWithLowMarketValue = [...tokensWithLowMarketValue, ...tokensWithNoMarketValue];
    const allLowMarketTokensHaveNoValue =
      tokensWithNoMarketValue.length === tokensWithLowMarketValue.length;
    return (
      <StyledGrid>
        <StyledLabelsRow>
          <StyledLabels>{lang.t('account.label_asset')}</StyledLabels>
          <StyledLabels>{lang.t('account.label_quantity')}</StyledLabels>
          <StyledLabels>{lang.t('account.label_price')}</StyledLabels>
          <StyledLabels>{lang.t('account.label_24h')}</StyledLabels>
          <StyledLabels>{lang.t('account.label_total')}</StyledLabels>
        </StyledLabelsRow>

        <StyledEthereum>
          <StyledAsset>
            <AssetIcon asset={ethereum.symbol} />
            <p>{ethereum.name}</p>
          </StyledAsset>
          <p>{ethereum.balance.display}</p>
          <p>{ethereum.native ? ethereum.native.price.display : '———'}</p>
          <StyledPercentage
            percentage={ethereum.native ? convertStringToNumber(ethereum.native.change.amount) : 0}
          >
            {ethereum.native ? ethereum.native.change.display : '———'}
          </StyledPercentage>
          <p>{ethereum.native ? ethereum.native.balance.display : '———'}</p>
        </StyledEthereum>
        {!!tokensWithHighMarketValue &&
          tokensWithHighMarketValue.map(token => (
            <StyledToken key={`${this.props.accountInfo.address}-${token.symbol}`}>
              <StyledAsset>
                <AssetIcon asset={token.address} />
                <p>{token.name}</p>
              </StyledAsset>
              <p>{token.balance.display}</p>
              <p>{token.native ? token.native.price.display : '———'}</p>
              <StyledPercentage
                percentage={token.native ? convertStringToNumber(token.native.change.amount) : 0}
              >
                {token.native ? token.native.change.display : '———'}
              </StyledPercentage>
              <p>{token.native ? token.native.balance.display : '———'}</p>
            </StyledToken>
          ))}
        {!!tokensWithLowMarketValue.length &&
          this.state.showMoreTokens &&
          tokensWithLowMarketValue.map(token => (
            <StyledToken key={`${this.props.accountInfo.address}-${token.symbol}`}>
              <StyledAsset>
                <AssetIcon asset={token.address} />
                <p>{token.name}</p>
              </StyledAsset>
              <p>{token.balance.display}</p>
              <p>{token.native ? token.native.price.display : '———'}</p>
              <StyledPercentage
                percentage={token.native ? convertStringToNumber(token.native.change.amount) : 0}
              >
                {token.native ? token.native.change.display : '———'}
              </StyledPercentage>
              <p>{token.native ? token.native.balance.display : '———'}</p>
            </StyledToken>
          ))}
        <StyledLastRow>
          {!!tokensWithLowMarketValue.length ? (
            <StyledShowMoreTokens onClick={this.onShowMoreTokens}>
              <div />
              {`${this.state.showMoreTokens ? lang.t('account.hide') : lang.t('account.show')} ${
                tokensWithLowMarketValue.length
              } ${
                tokensWithLowMarketValue.length === 1
                  ? lang.t('account.token')
                  : lang.t('account.tokens')
              } ${
                allLowMarketTokensHaveNoValue
                  ? lang.t('account.no_market_value')
                  : lang.t('account.low_market_value')
              }`}
            </StyledShowMoreTokens>
          ) : (
            <div />
          )}
          <p>{`${this.props.accountInfo.total.display || '———'}`}</p>
        </StyledLastRow>
      </StyledGrid>
    );
  }
}

AccountViewBalances.propTypes = {
  accountInfo: PropTypes.object.isRequired
};
const reduxProps = ({ account }) => ({
  accountInfo: account.accountInfo
});

export default connect(reduxProps, null)(AccountViewBalances);
