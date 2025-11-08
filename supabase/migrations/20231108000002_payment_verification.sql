-- Ödeme doğrulama ve coin dağıtımı için stored procedure
create or replace function verify_payment(
  p_payment_id uuid,
  p_tx_hash text,
  p_verified_amount numeric,
  p_from_address text
) returns json
language plpgsql
security definer
as $$
declare
  v_payment payments%rowtype;
  v_user_id uuid;
  v_coin_amount numeric;
begin
  -- Ödeme kaydını kilitle
  select * into v_payment
  from payments
  where id = p_payment_id
  for update;

  if not found then
    raise exception 'Ödeme bulunamadı';
  end if;

  if v_payment.status != 'pending' then
    raise exception 'Ödeme zaten işlendi';
  end if;

  -- Kullanıcı bilgisini al
  select user_id into v_user_id
  from payments
  where id = p_payment_id;

  -- Ödemeyi doğrulanmış olarak işaretle
  update payments
  set 
    status = 'verified',
    tx_hash = p_tx_hash,
    verified_amount = p_verified_amount,
    from_address = p_from_address,
    verified_at = now(),
    updated_at = now()
  where id = p_payment_id;

  -- Coin miktarını hesapla (1:1 oranı)
  v_coin_amount := p_verified_amount;

  -- Kullanıcıya coinleri dağıt
  insert into coin_transactions (
    user_id,
    amount,
    type,
    payment_id,
    created_at
  ) values (
    v_user_id,
    v_coin_amount,
    'payment',
    p_payment_id,
    now()
  );

  -- Kullanıcı bakiyesini güncelle
  update user_balances
  set 
    balance = balance + v_coin_amount,
    updated_at = now()
  where user_id = v_user_id;

  -- Ödemeyi tamamlandı olarak işaretle
  update payments
  set 
    status = 'completed',
    updated_at = now()
  where id = p_payment_id;

  return json_build_object(
    'success', true,
    'payment_id', p_payment_id,
    'amount', v_coin_amount
  );

exception when others then
  -- Hata durumunda rollback otomatik olarak gerçekleşir
  return json_build_object(
    'success', false,
    'error', SQLERRM
  );
end;
$$;