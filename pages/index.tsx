import type { NextPage } from 'next';
import Head from 'next/head';
import axios from 'axios';
import { useState } from 'react';
import { moneyMask, numberMask, dateMask, CPFMask } from '../utils/utils';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  type LoanValues = {
    name: string;
    cpf: string;
    uf: string;
    birthdate: string;
    requiredValue: string | number;
    monthsToPay: number | string;
    fee: string;
    installments: Array<{ date: string; value: string }>;
    totalValueToPay: string;
  };

  const [loanValues, setLoanValues] = useState<LoanValues>({
    name: '',
    cpf: '',
    uf: '',
    birthdate: '',
    requiredValue: '',
    monthsToPay: '',
    fee: '',
    installments: [],
    totalValueToPay: '',
  });
  const [hasSimulated, setHasSimulated] = useState(false);

  const simulateLoan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loanValues.uf === '') {
      alert('Por favor, escolha um estado válido.');
      return;
    }

    if (
      parseFloat(
        loanValues.requiredValue
          .toString()
          .substring(3)
          .replace('.', '')
          .replace(',', '.')
      ) < 50000
    ) {
      alert('O valor mínimo para empréstimo é de R$ 50.000,00.');
      return;
    }

    if (loanValues.monthsToPay > 360) {
      alert('O prazo máximo para pagamento são de 30 anos.');
      return;
    }

    axios
      .request({
        method: 'POST',
        url: 'https://emprestafacil-api.herokuapp.com/api/loan/simulate',
        data: {
          name: loanValues.name,
          cpf: loanValues.cpf,
          uf: loanValues.uf,
          birthdate: loanValues.birthdate,
          requiredValue: parseFloat(
            loanValues.requiredValue
              .toString()
              .substring(3)
              .replace('.', '')
              .replace(',', '.')
          ),
          monthsToPay: Number(loanValues.monthsToPay),
        },
      })
      .then((response) => {
        setLoanValues({
          ...loanValues,
          fee: response.data.fee,
          installments: response.data.installments,
          totalValueToPay: response.data.totalValueToPay,
        });
        setHasSimulated(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const createLoan = () => {
    axios
      .request({
        method: 'POST',
        url: 'https://emprestafacil-api.herokuapp.com/api/loan/create',
        data: {
          name: loanValues.name,
          cpf: loanValues.cpf,
          uf: loanValues.uf,
          birthdate: loanValues.birthdate,
          requiredValue: parseFloat(
            loanValues.requiredValue
              .toString()
              .substring(3)
              .replace('.', '')
              .replace(',', '.')
          ),
          monthsToPay: Number(loanValues.monthsToPay),
          fee: loanValues.fee,
          installments: loanValues.installments,
          totalValueToPay: loanValues.totalValueToPay,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          alert('Empréstimo criado com sucesso.');
          window.location.reload();
        } else {
          alert(
            'Erro ao efetuar empréstimo. Por favor, tente novamente dentro de alguns minutos.'
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>EmprestaFacil</title>
        <meta name="description" content="EmprestaFacil" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Simule e solicite o seu empréstimo</h1>

      <p>Preencha o formulário abaixo para simular</p>
      <div className={styles.simulationContainer}>
        <form onSubmit={simulateLoan}>
          <input
            type="text"
            name="name"
            id="name"
            autoComplete="off"
            placeholder="NOME COMPLETO"
            value={loanValues.name}
            onChange={(e) => {
              setLoanValues({ ...loanValues, name: e.target.value });
              setHasSimulated(false);
            }}
            required
          />
          <input
            type="text"
            name="cpf"
            id="cpf"
            autoComplete="off"
            placeholder="CPF"
            value={loanValues.cpf}
            onChange={(e) => {
              setLoanValues({ ...loanValues, cpf: CPFMask(e.target.value) });
              setHasSimulated(false);
            }}
            required
          />
          <select
            name="uf"
            id="uf"
            defaultValue={'UF'}
            required
            onChange={(e) => {
              setLoanValues({ ...loanValues, uf: e.target.value });
              setHasSimulated(false);
            }}
          >
            <option value="UF" disabled>
              UF
            </option>
            <option value="MG">MINAS GERAIS</option>
            <option value="SP">SÃO PAULO</option>
            <option value="RJ">RIO DE JANEIRO</option>
            <option value="ES">ESPIRITO SANTO</option>
          </select>
          <input
            type="text"
            name="birthdate"
            id="birthdate"
            autoComplete="off"
            placeholder="DATA DE NASCIMENTO"
            value={loanValues.birthdate}
            onChange={(e) => {
              setLoanValues({
                ...loanValues,
                birthdate: dateMask(e.target.value),
              });
              setHasSimulated(false);
            }}
            required
          />
          <input
            type="text"
            name="requiredValue"
            id="requiredValue"
            autoComplete="off"
            placeholder="VALOR REQUERIDO"
            value={loanValues.requiredValue}
            onChange={(e) => {
              setLoanValues({
                ...loanValues,
                requiredValue: moneyMask(e.target.value),
              });
              setHasSimulated(false);
            }}
            required
          />
          <input
            type="text"
            name="monthsToPay"
            id="monthsToPay"
            autoComplete="off"
            placeholder="MESES PARA PAGAR"
            value={loanValues.monthsToPay}
            onChange={(e) => {
              setLoanValues({
                ...loanValues,
                monthsToPay: numberMask(e.target.value),
              });
              setHasSimulated(false);
            }}
            required
          />
          <button type="submit">SIMULAR</button>
        </form>
      </div>

      {hasSimulated && (
        <>
          <p>Veja a simulação para o seu empréstimo antes de efetivar</p>
          <div className={styles.loanContainer}>
            <div className={styles.row}>
              <section>
                <p>VALOR REQUERIDO:</p>
                <strong>{loanValues.requiredValue}</strong>
              </section>
              <section>
                <p>TAXA DE JUROS</p>
                <strong>{loanValues.fee}</strong>
              </section>
            </div>

            <div className={styles.row}>
              <section>
                <p>PAGAR EM:</p>
                <strong>{loanValues.monthsToPay} mes(es)</strong>
              </section>
            </div>

            <p>PROJEÇÃO DAS PARCELAS:</p>

            {loanValues.installments.map((installment, key) => (
              <section key={key}>
                <div className={styles.row}>
                  <p>{installment.date}</p>
                  <p>R$ {installment.value.replace('.', ',')}</p>
                </div>
                <hr />
              </section>
            ))}

            <div className={styles.row}>
              <p>TOTAL</p>
              <p>R$ {loanValues.totalValueToPay.replace('.', ',')}</p>
            </div>

            <button onClick={createLoan}>EFETIVAR O EMPRÉSTIMO</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
