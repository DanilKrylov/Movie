import React, { useContext } from 'react'
import { NavBar } from '../../components/NavBar'
import { observer } from 'mobx-react'
import { Context } from '../..'
import { CompanyCinemasPage } from '../CompanyCinemasPage/CompanyCinemasPage'

export const CompanyPage = observer(() => {
  const {userSession} = useContext(Context)

  return (
    
    <div>
      <NavBar></NavBar>
      {userSession.isAuth && <CompanyCinemasPage></CompanyCinemasPage>}
    </div>
  )
})