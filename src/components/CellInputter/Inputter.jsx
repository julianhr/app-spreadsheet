import styled from '@emotion/styled'


export const Input = styled.input`
  align-items: center;
  background-color: white;
  border: 2px solid salmon;
  box-shadow: 0 0 5px ${props => props.theme.colors.shadow};
  box-sizing: border-box;
  display: flex;
  font-size: 13px;
  height: 100%;
  outline: none;
  padding: 2px;
  width: 100%;
`
